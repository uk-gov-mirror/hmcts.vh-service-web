import {Injectable} from '@angular/core';
import {MediaService} from './media.service';
import {Logger} from './logger';
import {SessionStorage} from '../modules/shared/services/session-storage';
import {BehaviorSubject} from 'rxjs';
import 'webrtc-adapter';
import {UserMediaDevice} from '../modules/shared/models/user-media-device';

const _navigator = <any>navigator;

_navigator.mediaDevices.getUserMedia = (_navigator.mediaDevices.getUserMedia ||
  _navigator.webkitGetUserMedia ||
  _navigator.mozGetUserMedia ||
  _navigator.msGetUserMedia);

@Injectable({
  providedIn: 'root',
})
export class UserMediaService extends MediaService {

  readonly constraints: MediaStreamConstraints = {
    audio: true,
    video: true
  };

  private readonly preferredCamCache: SessionStorage<UserMediaDevice>;
  private readonly preferredMicCache: SessionStorage<UserMediaDevice>;
  readonly PREFERRED_CAMERA_KEY = 'vh.preferred.camera';
  readonly PREFERRED_MICROPHONE_KEY = 'vh.preferred.microphone';
  private stream: MediaStream;
  availableDeviceList: UserMediaDevice[];
  connectedDevices: BehaviorSubject<UserMediaDevice[]> = new BehaviorSubject([]);

  constructor(private logger: Logger) {
    super();

    this.preferredCamCache = new SessionStorage(this.PREFERRED_CAMERA_KEY);
    this.preferredMicCache = new SessionStorage(this.PREFERRED_MICROPHONE_KEY);

    _navigator.mediaDevices.ondevicechange = async () => {
      await this.updateAvailableDevicesList();
    };
  }

  async getListOfVideoDevices(): Promise<UserMediaDevice[]> {
    await this.checkDeviceListIsReady();
    return this.availableDeviceList.filter(x => x.kind === 'videoinput');
  }

  async getListOfMicrophoneDevices(): Promise<UserMediaDevice[]> {
    await this.checkDeviceListIsReady();
    return this.availableDeviceList.filter(x => x.kind === 'audioinput');
  }

  async checkDeviceListIsReady() {
    if (!this.availableDeviceList) {
      await this.updateAvailableDevicesList();
    }
  }

  async updateAvailableDevicesList(): Promise<void> {
    if (!_navigator.mediaDevices || !_navigator.mediaDevices.enumerateDevices) {
      throw new Error('enumerateDevices() not supported.');
    }
    let updatedDevices: MediaDeviceInfo[] = await _navigator.mediaDevices.enumerateDevices();
    updatedDevices = updatedDevices.filter(x => x.deviceId !== 'default' && x.kind !== 'audiooutput');
    this.availableDeviceList = Array.from(updatedDevices, device =>
      new UserMediaDevice(device.label, device.deviceId, device.kind, device.groupId)
    );
    this.connectedDevices.next(this.availableDeviceList);
  }

  async hasMultipleDevices(): Promise<boolean> {
    const camDevices = await this.getListOfVideoDevices();
    const micDevices = await this.getListOfMicrophoneDevices();
    return micDevices.length > 1 || camDevices.length > 1;
  }

  getPreferredCamera() {
    return this.getCachedDeviceIfStillConnected(this.preferredCamCache);
  }

  getPreferredMicrophone() {
    return this.getCachedDeviceIfStillConnected(this.preferredMicCache);
  }

  getCachedDeviceIfStillConnected(cache: SessionStorage<UserMediaDevice>): UserMediaDevice {
    const device = cache.get();
    if (!device) {
      return null;
    }
    const stillConnected = this.availableDeviceList.find(x => x.label === device.label);
    if (stillConnected) {
      return device;
    } else {
      cache.clear();
      return null;
    }
  }

  updatePreferredCamera(camera: UserMediaDevice) {
    this.preferredCamCache.set(camera);
  }

  updatePreferredMicrophone(microphone: UserMediaDevice) {
    this.preferredMicCache.set(microphone);
  }

  async requestAccess(): Promise<boolean> {
    try {
      await this.getStream();
      return true;
    } catch (exception) {
      this.logger.error('Failed to get access to user media', exception);
      return false;
    }
  }

  async getStream(): Promise<MediaStream> {
    if (this.stream) {
      this.stopStream();
    }
    this.stream = await _navigator.mediaDevices.getUserMedia(this.constraints);
    return this.stream;
  }

  stopStream() {
    if (!this.stream) {
      return;
    }
    this.stream.getAudioTracks().forEach((track) => {
      track.stop();
    });
    this.stream.getVideoTracks().forEach((track) => {
      track.stop();
    });
  }
}

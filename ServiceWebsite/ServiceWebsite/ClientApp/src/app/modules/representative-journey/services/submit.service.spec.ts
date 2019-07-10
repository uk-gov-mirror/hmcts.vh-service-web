import { SubmitService } from './submit.service';
import { MutableRepresentativeSuitabilityModel } from '../mutable-representative-suitability.model';
import {Hearing, HasAccessToCamera, SelfTestAnswers} from '../../base-journey/participant-suitability.model';
import { RepresentativeSuitabilityService } from './representative-suitability.service';

describe('SubmitService', () => {
  const suitabilityService = jasmine.createSpyObj<RepresentativeSuitabilityService>(['updateSuitabilityAnswers']);
  const submitService = new SubmitService(suitabilityService);

  const model = new MutableRepresentativeSuitabilityModel();
  beforeEach(() => {
    model.hearing = new Hearing();
    model.aboutYou.answer = true;
    model.aboutYou.notes = 'notes';
    model.aboutYourClient.answer = true;
    model.clientAttendance = true;
    model.aboutYourClient.notes = 'notes';
    model.hearingSuitability.answer = true;
    model.hearingSuitability.notes = 'notes';
    model.computer = true;
    model.camera = HasAccessToCamera.Yes;
    model.room = true;
    model.selfTest = new SelfTestAnswers();
    model.selfTest.cameraWorking = true;
    model.selfTest.microphoneWorking = true;
    model.selfTest.seeAndHearClearly = true;
    model.selfTest.checkYourComputer = true;
   });

  it('should call the suitability service to submit answers', async () => {
    await submitService.submit(model);
    expect(suitabilityService.updateSuitabilityAnswers).toHaveBeenCalled();
  });
});

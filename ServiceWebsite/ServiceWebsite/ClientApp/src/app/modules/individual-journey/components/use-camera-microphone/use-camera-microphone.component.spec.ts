import { ComponentFixture } from '@angular/core/testing';

import { ConfigureTestBedFor } from '../individual-base-component/component-test-bed';
import { UseCameraMicrophoneComponent } from './use-camera-microphone.component';


describe('UseCameraMicrophoneComponent', () => {
  let component: UseCameraMicrophoneComponent;
  let fixture: ComponentFixture<UseCameraMicrophoneComponent>;

  beforeEach(() => {
    fixture = ConfigureTestBedFor(UseCameraMicrophoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

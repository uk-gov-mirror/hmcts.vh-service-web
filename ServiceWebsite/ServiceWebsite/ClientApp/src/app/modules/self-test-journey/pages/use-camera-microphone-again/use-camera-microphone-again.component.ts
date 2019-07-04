import {Component, OnInit} from '@angular/core';
import {JourneyBase} from '../../../base-journey/journey-base';

import { SelfTestJourneySteps } from '../../self-test-journey-steps';

@Component({
  selector: 'app-use-camera-microphone-again',
  templateUrl: './use-camera-microphone-again.component.html',
  styles: []
})
export class UseCameraMicrophoneAgainComponent  {

  constructor(private journey: JourneyBase) {
    
  }

  ngOnInit(): void {
  }

  protected bindModel(): void {
  }

  switchOnCameraAndMicrophone(): void {
  }

  continue() {
    this.journey.goto(SelfTestJourneySteps.SelfTest);
  }
}

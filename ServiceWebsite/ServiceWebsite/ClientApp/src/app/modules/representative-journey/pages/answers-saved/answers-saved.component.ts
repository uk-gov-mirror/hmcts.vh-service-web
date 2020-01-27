import {Component} from '@angular/core';
import {RepresentativeJourney} from '../../representative-journey';
import {RepresentativeSuitabilityModel} from '../../representative-suitability.model';
import { RepresentativeJourneySteps } from '../../representative-journey-steps';


@Component({
  selector: 'app-answers-saved',
  templateUrl: './answers-saved.component.html',
  styleUrls: ['./answers-saved.component.css']
})

export class AnswersSavedComponent {
  constructor(private journey: RepresentativeJourney) {
  }

  get model(): RepresentativeSuitabilityModel {
    return this.journey.model;
  }

  continue() {
    this.journey.goto(RepresentativeJourneySteps.CheckYourComputer);
  }
}


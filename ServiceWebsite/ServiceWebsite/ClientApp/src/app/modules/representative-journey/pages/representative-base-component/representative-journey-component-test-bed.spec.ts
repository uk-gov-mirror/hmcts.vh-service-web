import { MutableRepresentativeSuitabilityModel } from '../../mutable-representative-suitability.model';
import { ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RepresentativeJourney } from '../../representative-journey';
import { RepresentativeSuitabilityModel } from '../../representative-suitability.model';
import { Hearing } from '../../../base-journey/participant-suitability.model';
import { RepresentativeStepsOrderFactory } from '../../representative-steps-order.factory';
import {
  ComponentTestBedConfiguration,
  JourneyComponentTestBed
} from 'src/app/modules/base-journey/components/journey-component-test-bed.spec';

@Component({ selector: 'app-hearing-details-header', template: ''})
export class StubHearingDetailsHeaderComponent {}

export interface RepresentativeComponentTestBedConfiguration<TComponent> extends ComponentTestBedConfiguration<TComponent> {
  journey?: RepresentativeJourney;
}

export class RepresentativeJourneyStubs {
  public static get default(): RepresentativeJourney {
      // Journey with initialised model, so that it is accessible in steeps
    const representativeStepsOrderFactory = new RepresentativeStepsOrderFactory();
    const journey = new RepresentativeJourney(representativeStepsOrderFactory);
    const journeyModel = new MutableRepresentativeSuitabilityModel();

    journeyModel.hearing = new Hearing('hearingId', new Date(2099, 1, 1, 12, 0));
    journey.forSuitabilityAnswers([journeyModel]);
    return journey;
  }
}

export class RepresentativeJourneyComponentTestBed {
  static createComponent<TComponent>(config: RepresentativeComponentTestBedConfiguration<TComponent>): ComponentFixture<TComponent> {
    return new JourneyComponentTestBed()
      .createComponent({
        component: config.component,
        declarations: [
          StubHearingDetailsHeaderComponent,
          ...(config.declarations || [])
        ],
        providers: [
          { provide: RepresentativeSuitabilityModel, useClass: MutableRepresentativeSuitabilityModel },
          { provide: RepresentativeJourney, useValue: config.journey || RepresentativeJourneyStubs.default },
          ...(config.providers || [])
        ],
        imports: config.imports
      });
  }
}
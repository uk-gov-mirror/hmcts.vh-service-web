import { MutableIndividualSuitabilityModel } from '../../mutable-individual-suitability.model';
import { ComponentFixture } from '@angular/core/testing';

import { IndividualLocalisation } from '../../services/individual-localisation';
import { Localisation } from 'src/app/modules/shared/localisation';
import { IndividualJourney } from '../../individual-journey';
import { Hearing } from '../../../base-journey/participant-suitability.model';
import { IndividualStepsOrderFactory } from '../../individual-steps-order.factory';
import { DeviceType } from '../../services/device-type';
import { IndividualSuitabilityModel } from '../../individual-suitability.model';
import {
  JourneyComponentTestBed,
  ComponentTestBedConfiguration
} from 'src/app/modules/base-journey/components/journey-component-test-bed.spec';
import { LongDatetimePipe } from 'src/app/modules/shared/date-time.pipe';

export interface IndividualComponentTestBedConfiguration<TComponent> extends ComponentTestBedConfiguration<TComponent> {
  journey?: IndividualJourney;
}

export class IndividualJourneyStubs {
  public static get default(): IndividualJourney {
    const deviceType = jasmine.createSpyObj<DeviceType>(['isMobile']);
    const individualStepsOrderFactory = new IndividualStepsOrderFactory(deviceType);
    deviceType.isMobile.and.returnValue(false);
    const journey = new IndividualJourney(individualStepsOrderFactory);
    const journeyModel = new MutableIndividualSuitabilityModel();

    journeyModel.hearing = new Hearing('hearingId', new Date(2099, 1, 1, 12, 0));
    journey.forSuitabilityAnswers([journeyModel]);
    return journey;
  }
}

export class IndividualJourneyComponentTestBed {
  static createComponent<TComponent>(config: IndividualComponentTestBedConfiguration<TComponent>): ComponentFixture<TComponent> {
    return new JourneyComponentTestBed()
      .createComponent({
        component: config.component,
        declarations: [
          LongDatetimePipe,
          ...(config.declarations || [])
        ],
        providers: [
          { provide: IndividualSuitabilityModel, useClass: MutableIndividualSuitabilityModel },
          { provide: Localisation, useClass: IndividualLocalisation },
          { provide: IndividualJourney, useValue: config.journey || IndividualJourneyStubs.default },
          ...(config.providers || [])
        ],
        imports: config.imports
      });
  }
}

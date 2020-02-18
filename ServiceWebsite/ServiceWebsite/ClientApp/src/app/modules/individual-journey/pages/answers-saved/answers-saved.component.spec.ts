import { AnswersSavedComponent } from './answers-saved.component';
import { AppYesNoPipe } from '../../../shared/boolean.pipe';
import {
  IndividualJourneyComponentTestBed,
  IndividualJourneyStubs
} from '../individual-base-component/individual-component-test-bed.spec';
import { SuitabilityChoiceComponentFixture } from 'src/app/modules/base-journey/components/suitability-choice-component-fixture.spec';
import { SelfTestJourneySteps } from 'src/app/modules/self-test-journey/self-test-journey-steps';

describe('AnswersSavedComponent', () => {
  it(`goes to ${SelfTestJourneySteps.CheckYourComputer} when pressing continue`, () => {
    const journey = IndividualJourneyStubs.journeySpy;

    const componentFixture = IndividualJourneyComponentTestBed.createComponent({
      component: AnswersSavedComponent,
      declarations: [AppYesNoPipe],
      journey: journey
    });

    const fixture = new SuitabilityChoiceComponentFixture(componentFixture);
    fixture.submitIsClicked();

    expect(journey.goto).toHaveBeenCalledWith(SelfTestJourneySteps.CheckYourComputer);
  });
});

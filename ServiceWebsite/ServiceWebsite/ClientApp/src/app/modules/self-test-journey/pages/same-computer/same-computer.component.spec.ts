import { JourneyBase } from 'src/app/modules/base-journey/journey-base';
import { SelfTestJourneyComponentTestBed } from '../self-test-base-component/self-test-component-test-bed.spec';
import {
  CrestBluePanelComponent
} from '../../../shared/crest-blue-panel/crest-blue-panel.component';
import { ContinuableComponentFixture } from '../../../base-journey/components/suitability-choice-component-fixture.spec';
import { SameComputerComponent } from './same-computer.component';
import { SelfTestJourneySteps } from '../../self-test-journey-steps';

describe('SameComputerComponent', () => {
  it(`goes to ${SelfTestJourneySteps.UseCameraAndMicrophoneAgain} if not on mobile device`, () => {
    const journey = jasmine.createSpyObj<JourneyBase>(['goto']);
    const fixture = SelfTestJourneyComponentTestBed.createComponent({
      component: SameComputerComponent,
      declarations: [CrestBluePanelComponent],
      journey: journey
    });

    fixture.detectChanges();
    new ContinuableComponentFixture(fixture).submitIsClicked();
    expect(journey.goto).toHaveBeenCalledWith(SelfTestJourneySteps.UseCameraAndMicrophoneAgain);
  });
});

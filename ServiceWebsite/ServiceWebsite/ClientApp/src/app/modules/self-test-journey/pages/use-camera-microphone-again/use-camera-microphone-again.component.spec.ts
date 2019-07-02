import {SelfTestJourneyComponentTestBed} from '../self-test-base-component/self-test-component-test-bed.spec';
import {
  CrestBluePanelComponent
} from '../../../shared/crest-blue-panel/crest-blue-panel.component';
import {SelfTestJourney} from '../../self-test-journey';
import {ContinuableComponentFixture} from '../../../base-journey/components/suitability-choice-component-fixture.spec';
import {UseCameraMicrophoneAgainComponent} from './use-camera-microphone-again.component';

describe('UseCameraMicrophoneAgainComponent', () => {
  it('can continue', () => {
    const journey = jasmine.createSpyObj<SelfTestJourney>(['next']);
    const fixture = SelfTestJourneyComponentTestBed.createComponent({
      component: UseCameraMicrophoneAgainComponent,
      declarations: [CrestBluePanelComponent],
      providers: [{provide: SelfTestJourney, useValue: journey}]
    });

    fixture.detectChanges();
    new ContinuableComponentFixture(fixture).submitIsClicked();
    expect(journey.next).toHaveBeenCalled();
  });
});

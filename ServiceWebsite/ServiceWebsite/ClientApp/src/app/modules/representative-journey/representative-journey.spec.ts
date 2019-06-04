import { MutableRepresentativeSuitabilityModel } from './mutable-representative-suitability.model';
import { RepresentativeJourney } from './representative-journey';
import { HasAccessToCamera, Hearing } from '../base-journey/participant-suitability.model';
import { RepresentativeStepsOrderFactory } from './representative-steps-order.factory';
import { RepresentativeJourneySteps as Steps, RepresentativeJourneySteps } from './representative-journey-steps';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(tomorrow.getDate() + 2);

describe('RepresentativeJourney', () => {
  let journey: RepresentativeJourney;
  let redirected: Steps;

  const getModelForHearing = (id: string, scheduledDateTime: Date) => {
    const model = new MutableRepresentativeSuitabilityModel();
    model.hearing = new Hearing(id, scheduledDateTime);
    return model;
  };

  const getCompletedModel = (id: string) => {
    const model = getModelForHearing(id, tomorrow);
    model.aboutYou.answer = false;
    model.aboutYourClient.answer = true;
    model.hearingSuitability.answer = true;
    model.clientAttenance = true;
    model.camera = HasAccessToCamera.Yes;
    model.computer = true;
    model.room = true;
    return model;
  };

  // helper test data
  const suitabilityAnswers = {
    oneUpcomingHearing: [
      getModelForHearing('upcoming hearing id', tomorrow)
    ],
    twoUpcomingHearings: [
      getModelForHearing('later upcoming hearing id', dayAfterTomorrow),
      getModelForHearing('earlier upcoming hearing id', tomorrow)
    ],
    alreadyCompleted: [
      getCompletedModel('completed hearing id')
    ],
    completedAndUpcoming: [
      getModelForHearing('upcoming hearing id', tomorrow),
      getCompletedModel('completed hearing id'),
      getModelForHearing('another upcoming hearing id', tomorrow)
    ],
    noUpcomingHearings: []
  };
  const representativeStepsOrderFactory = new RepresentativeStepsOrderFactory();

  beforeEach(() => {
    redirected = null;
    journey = new RepresentativeJourney(representativeStepsOrderFactory);
    journey.forSuitabilityAnswers(suitabilityAnswers.oneUpcomingHearing);

    journey.redirect.subscribe((s: Steps) => redirected = s);
  });

  const whenProceeding = () => {
    journey.next();
  };

  const whenFailingTheStep = () => {
    journey.fail();
  };

  const givenUserIsAtStep = (s: RepresentativeJourneySteps) => {
    journey.jumpTo(s);
  };

  const expectStep = (s: RepresentativeJourneySteps): jasmine.ArrayLikeMatchers<string> => {
    return expect(RepresentativeJourneySteps[s]);
  };

  const step = (s: RepresentativeJourneySteps): string => {
    return RepresentativeJourneySteps[s];
  };

  const nextStepIs = (expectedStep: RepresentativeJourneySteps) => {
    whenProceeding();
    expectStep(redirected).toBe(step(expectedStep));
  };

  it('should follow the happy path journey', () => {
    // given we're starting at the beginning
    journey.startAt(RepresentativeJourney.initialStep);

    // then the happy path journey would be
    nextStepIs(Steps.AboutYouAndYourClient);
    nextStepIs(Steps.AboutYou);
    nextStepIs(Steps.AccessToRoom);
    nextStepIs(Steps.AboutYourClient);
    nextStepIs(Steps.ClientAttendance);
    nextStepIs(Steps.HearingSuitability);
    nextStepIs(Steps.AccessToComputer);
    nextStepIs(Steps.AboutYourComputer);
    nextStepIs(Steps.QuestionnaireCompleted);
    // this last step is pending change, will proceed to self test in the future
    nextStepIs(Steps.ThankYou);
  });

  const expectDropOffToQuestionnaireCompletedFrom = (s: RepresentativeJourneySteps) => {
    givenUserIsAtStep(s);
    whenFailingTheStep();
    expectStep(redirected).toBe(step(Steps.QuestionnaireCompleted));
  };
  const expectDropOffToContactUsFrom = (s: RepresentativeJourneySteps) => {
    givenUserIsAtStep(s);
    whenProceeding();
    expectStep(redirected).toBe(step(Steps.ContactUs));
  };
/*   const expectDropOffToThankYouFrom = (s: RepresentativeJourneySteps) => {
    givenUserIsAtStep(s);
    whenProceeding();
    expectStep(redirected).toBe(step(Steps.ThankYou));
  }; */

  it(`should continue to ${Steps.QuestionnaireCompleted} if representative has no access to a computer`, () => {
    givenUserIsAtStep(Steps.AccessToComputer);
    journey.model.computer = false;
    journey.next();
    expectDropOffToQuestionnaireCompletedFrom(Steps.AccessToComputer);
  });
  it(`should continue to ${Steps.ContactUs} from ${Steps.QuestionnaireCompleted} if representative has no access to a computer`, () => {
    givenUserIsAtStep(Steps.QuestionnaireCompleted);
    journey.model.computer = false;
    journey.next();
    expectDropOffToContactUsFrom(Steps.QuestionnaireCompleted);
  });
  it(`should continue to ${Steps.QuestionnaireCompleted} if representative has no camera`, () => {
    givenUserIsAtStep(Steps.AboutYourComputer);
    journey.model.camera = HasAccessToCamera.No;
    journey.next();
    expectDropOffToQuestionnaireCompletedFrom(Steps.AccessToComputer);
  });
  it(`should continue to ${Steps.ContactUs} from ${Steps.QuestionnaireCompleted} if representative has no camera`, () => {
    givenUserIsAtStep(Steps.QuestionnaireCompleted);
    journey.model.camera = HasAccessToCamera.No;
    journey.next();
    expectDropOffToContactUsFrom(Steps.QuestionnaireCompleted);
  });
  it(`should continue to ${Steps.ThankYou} from ${Steps.QuestionnaireCompleted}
      if representative answered 'yes' or 'i'm not sure' to camera question`, () => {
      givenUserIsAtStep(Steps.QuestionnaireCompleted);
      journey.model.camera = HasAccessToCamera.NotSure;
      journey.next();
      nextStepIs(Steps.ThankYou);
      /* expectDropOffToThankYouFrom(Steps.QuestionnaireCompleted); */
    });

  it('should raise an error on unexpected failure transition', () => {
    givenUserIsAtStep(Steps.AboutVideoHearings);
    expect(() => whenFailingTheStep())
      .toThrowError(`Missing/unexpected failure for step: ${RepresentativeJourneySteps[Steps.AboutVideoHearings]}`);
  });

  /*   it('should raise an error on missing transition', () => {
      givenUserIsAtStep(Steps.ThankYou);
      expect(() => whenProceeding())
        .toThrowError(`Missing transition for step: ${RepresentativeJourneySteps[Steps.ThankYou]}`);
    }); */

  it('should goto video app if there are no upcoming hearings', () => {
    journey.forSuitabilityAnswers(suitabilityAnswers.noUpcomingHearings);
    journey.jumpTo(Steps.AboutVideoHearings);
    expectStep(redirected).toBe(Steps[Steps.GotoVideoApp]);
  });

  it('should goto video app if trying to enter a finished journey', () => {
    // given journey that's finished
    journey.forSuitabilityAnswers(suitabilityAnswers.alreadyCompleted);

    // when trying to enter later in the journey
    journey.jumpTo(Steps.ClientAttendance);
    expectStep(redirected).toBe(Steps[Steps.GotoVideoApp]);
  });

  it('should stay where it is if trying to enter at the current step', () => {
    const currentStep = redirected;
    redirected = null;

    // when trying to go to the same step
    journey.jumpTo(currentStep);

    // we shouldn't have moved
    expect(redirected).toBeNull();
  });

  it('should run the story for the first upcoming hearing', () => {
    journey.forSuitabilityAnswers(suitabilityAnswers.twoUpcomingHearings);
    expect(journey.model.hearing.id).toBe('earlier upcoming hearing id');
  });

  it('should redirect fo video app if any suitability answers have been answered', () => {
    journey.forSuitabilityAnswers(suitabilityAnswers.completedAndUpcoming);
    journey.jumpTo(Steps.AboutVideoHearings);
    expect(redirected).toBe(Steps.GotoVideoApp);
  });

  it('should throw exception if trying to enter or proceed journey without having been initialised', () => {
    // given a journey that's not been initialised
    const uninitialisedJourney = new RepresentativeJourney(representativeStepsOrderFactory);
    const expectedError = 'Journey must be initialised with suitability answers';
    expect(() => uninitialisedJourney.jumpTo(Steps.ClientAttendance)).toThrowError(expectedError);
    expect(() => uninitialisedJourney.next()).toThrowError(expectedError);
  });

  it('should throw an exception if proceeding without having entered the journey', () => {
    expect(() => journey.next()).toThrowError('Journey must be entered before navigation is allowed');
  });
});

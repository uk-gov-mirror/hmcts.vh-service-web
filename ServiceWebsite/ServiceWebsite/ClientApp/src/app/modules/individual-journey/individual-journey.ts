import { EventEmitter, Injectable } from '@angular/core';
import { JourneyBase } from '../base-journey/journey-base';
import { IndividualSuitabilityModel } from './individual-suitability.model';

export enum IndividualJourneySteps {
    AboutHearings,
    DifferentHearingTypes,
    ExploreCourtBuilding,
    CourtInformationVideo,
    AccessToCameraAndMicrophone,
    HearingAsParticipant,
    HearingAsJudge,
    HelpTheCourtDecide,
    AboutYou,
    Interpreter,
    AccessToComputer,
    AboutYourComputer,
    YourInternetConnection,
    AccessToRoom,
    Consent,
    ThankYou,
    MediaAccessError
}

@Injectable()
export class IndividualJourney implements JourneyBase {
    readonly redirect: EventEmitter<IndividualJourneySteps> = new EventEmitter();

    private currentStep: IndividualJourneySteps;

    private readonly stepOrder: IndividualJourneySteps[];

    private currentModel: IndividualSuitabilityModel;

    constructor(model: IndividualSuitabilityModel) {
        this.currentModel = model;

        this.stepOrder = [
            IndividualJourneySteps.AboutHearings,
            IndividualJourneySteps.DifferentHearingTypes,
            IndividualJourneySteps.ExploreCourtBuilding,
            IndividualJourneySteps.CourtInformationVideo,
            IndividualJourneySteps.AccessToCameraAndMicrophone,
            IndividualJourneySteps.HearingAsParticipant,
            IndividualJourneySteps.HearingAsJudge,
            IndividualJourneySteps.HelpTheCourtDecide,
            IndividualJourneySteps.AboutYou,
            IndividualJourneySteps.Interpreter,
            IndividualJourneySteps.AccessToComputer,
            IndividualJourneySteps.AboutYourComputer,
            IndividualJourneySteps.YourInternetConnection,
            IndividualJourneySteps.AccessToRoom,
            IndividualJourneySteps.Consent,
            IndividualJourneySteps.ThankYou
        ];

        this.redirect.subscribe((step: IndividualJourneySteps) => this.currentStep = step);
    }

    get model(): IndividualSuitabilityModel {
        return this.currentModel;
    }

    withAnswers(model: IndividualSuitabilityModel) {
        this.currentModel = model;
    }

    withNoUpcomingHearings() {
        this.currentModel = null;
    }

    isCompleted(): boolean {
        // TODO: Or are we completed if anything has been submitted?
        return this.currentModel.aboutYou.answer !== undefined
            && this.currentModel.computer !== undefined
            && this.currentModel.consent !== undefined
            && this.currentModel.internet !== undefined
            && this.currentModel.interpreter !== undefined
            && this.currentModel.room !== undefined;
    }

    private goto(step: IndividualJourneySteps) {
        if (this.currentStep !== step) {
            this.redirect.emit(step);
        }
    }

    /**
     * Get the current step
     */
    get step(): IndividualJourneySteps {
        return this.currentStep;
    }

    begin() {
        this.goto(IndividualJourneySteps.AboutHearings);
    }

    next() {
        const currentStep = this.stepOrder.indexOf(this.currentStep);
        if (currentStep < 0 || currentStep === this.stepOrder.length - 1) {
            throw new Error('Missing transition for step: ' + IndividualJourneySteps[this.currentStep]);
        }

        const nextStep = this.stepOrder[currentStep + 1];
        this.goto(nextStep);
    }

    fail() {
        const dropoutToThankYouFrom = [
            IndividualJourneySteps.AccessToComputer,
            IndividualJourneySteps.AboutYourComputer,
            IndividualJourneySteps.YourInternetConnection,
            IndividualJourneySteps.Consent
        ];

        if (dropoutToThankYouFrom.includes(this.currentStep)) {
            this.goto(IndividualJourneySteps.ThankYou);
        } else if (this.currentStep === IndividualJourneySteps.AccessToCameraAndMicrophone) {
            this.goto(IndividualJourneySteps.MediaAccessError);
        } else {
            throw new Error(`Missing/unexpected failure for step: ${IndividualJourneySteps[this.currentStep]}`);
        }
    }

    /**
     * Fast forwards or rewinds the journey to a given place.
     * @param position The step to jump to
     */
    jumpTo(position: IndividualJourneySteps) {
        this.currentStep = position;
    }
}

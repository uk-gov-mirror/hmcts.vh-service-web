import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SuitabilityChoicePageBaseComponent } from '../../components/suitability-choice-page-base.component';
import { ValidateForWhiteSpace } from '../../../shared/validators/whitespace-validator';
import { IndividualJourney } from '../../individual-journey';
import { IndividualJourneySteps } from '../../individual-journey-steps';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent extends SuitabilityChoicePageBaseComponent implements OnInit {

  readonly textInputYes = new FormControl({ value: '', disabled: true });
  readonly textInputNo = new FormControl({ value: '', disabled: true });
  noSelected = false;

  constructor(journey: IndividualJourney) {
    super(journey);
  }

  ngOnInit() {
    this.form.addControl('textInputYes', this.textInputYes);
    this.form.addControl('textInputNo', this.textInputNo);

    this.choice.setValue(this.model.consent.answer);
    if (this.model.consent.answer === true) {
      this.textInputYes.setValue(this.model.consent.notes);
    } else {
      this.textInputNo.setValue(this.model.consent.notes);
    }

    this.choice.valueChanges.subscribe(value => {
      if (value) {
        // If the value is true, the text input for yes is required
        this.optionYes();
      } else {
        this.optionNo();
      }

      // calling these will update the forms validity based on the changed validations
      this.textInputYes.updateValueAndValidity();
      this.textInputNo.updateValueAndValidity();
      this.form.updateValueAndValidity();

      // if we've tried submitting without and answer select an answer that has another required field
      // we want to treat this as "a new form", the user hasn't seen these fields so we need to treat the
      // form as pristine until the next time the user has tried to submit, this reduces flickering of the
      // error messages as the user focuses/blurs and enters text
      this.submitted = false;
    });
  }

  private optionYes() {
    this.textInputYes.markAsUntouched();
    this.textInputYes.enable();
    this.noSelected = false;

    this.textInputNo.clearValidators();
    this.textInputNo.disable();
    this.textInputNo.setValue('');
  }

  private optionNo() {
    this.textInputNo.setValidators([Validators.required, ValidateForWhiteSpace]);
    this.textInputNo.markAsUntouched();
    this.textInputNo.enable();
    this.noSelected = true;

    this.textInputYes.clearValidators();
    this.textInputYes.disable();
    this.textInputYes.setValue('');
  }

  get isTextInputNoInvalid(): boolean {
    return this.textInputNo.invalid && this.submitted;
  }

  continue() {
    this.textInputYes.markAsTouched();
    super.continue();
  }

  protected bindModel(): void {
    this.model.consent.answer = this.choice.value;
    this.model.consent.notes = this.choice.value ? this.textInputYes.value : this.textInputNo.value;
  }

  async submit(): Promise<void> {
    if (this.trySubmit()) {
      await this.journey.submitQuestionnaire();
      this.journey.goto(IndividualJourneySteps.ThankYou);
    }
  }
}

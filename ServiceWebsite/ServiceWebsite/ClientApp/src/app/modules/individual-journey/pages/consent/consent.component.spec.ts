import { SuitabilityChoiceComponentFixture } from 'src/app/modules/base-journey/components/suitability-choice-component-fixture.spec';
import { ConsentComponent } from './consent.component';
import { IndividualJourneyComponentTestBed } from '../individual-base-component/individual-component-test-bed.spec';

describe('ConsentComponent', () => {
  let fixture: SuitabilityChoiceComponentFixture;
  let component: ConsentComponent;

  beforeEach(() => {
    const componentFixture = IndividualJourneyComponentTestBed.createComponent({component: ConsentComponent});
    fixture = new SuitabilityChoiceComponentFixture(componentFixture);
    component = componentFixture.componentInstance;
    fixture.detectChanges();
  });

  it('cannot proceed to next step before selecting a choice', () => {
    // when
    fixture.submitIsClicked();

    // then
    expect(component.isInvalid).toBeTruthy();

    // expect form to display error class
    const formContainer = fixture.debugElementByCss('#form-container');
    expect(formContainer.classes['govuk-form-group--error']).toBeTruthy();

    // and error message to be displayed
    const errorMessage = fixture.debugElementByCss('#form-container .govuk-error-message');
    expect(errorMessage.nativeElement).toBeTruthy();
  });

  it('should clear error when selecting no', () => {
    fixture.submitIsClicked();
    fixture.radioBoxIsClicked('#choice-no');
    expect(component.isInvalid).toBeFalsy();
  });

  it('should clear error when selecting yes after having submitted', () => {
    fixture.submitIsClicked();
    fixture.radioBoxIsClicked('#choice-yes');
    expect(component.isInvalid).toBeFalsy();
  });

  it('should enable text field when selecting yes', () => {
    fixture.radioBoxIsClicked('#choice-yes');
    const textfield = fixture.debugElementByCss('#details-yes');
    expect(textfield.attributes['disabled']).toBeFalsy();
  });

  it('should enable text field when selecting no', () => {
    fixture.radioBoxIsClicked('#choice-no');
    const textfield = fixture.debugElementByCss('#details-no');
    expect(textfield.attributes['disabled']).toBeFalsy();
  });

  it('should be valid if submitting without having entered any text in yes note', () => {
    // when
    fixture.radioBoxIsClicked('#choice-yes');
    fixture.submitIsClicked();

    // then
    expect(component.isInvalid).toBeFalsy();
    const textfield = fixture.debugElementByCss('#details-yes');
    expect(textfield.classes['govuk-textarea--error']).toBeFalsy();
  });

  it('should be invalid if submitting without having entered any text in no note', () => {
    // when
    fixture.radioBoxIsClicked('#choice-no');
    fixture.submitIsClicked();

    // then
    expect(component.isInvalid).toBeTruthy();
    const textfield = fixture.debugElementByCss('#details-no');
    expect(textfield.classes['govuk-textarea--error']).toBeTruthy();
  });

  it('should bind value and notes for option yes to model on submit', () => {
    // when
    fixture.radioBoxIsClicked('#choice-yes');
    component.textInputYes.setValue('notes');
    fixture.detectChanges();
    fixture.submitIsClicked();

    // then
    expect(component.model.consent.answer).toBe(true);
    expect(component.model.consent.notes).toBe('notes');
  });

  it('should bind value and notes for option no to model on submit', () => {
    // when
    fixture.radioBoxIsClicked('#choice-no');
    component.textInputNo.setValue('notes');
    fixture.detectChanges();
    fixture.submitIsClicked();

    // then
    expect(component.model.consent.answer).toBe(false);
    expect(component.model.consent.notes).toBe('notes');
  });
});


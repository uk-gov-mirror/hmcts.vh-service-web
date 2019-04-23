import { LocalisePipe } from './../../pipes/localise.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHearingsComponent } from './about-hearings.component';
import { IndividualLocalisation } from '../../services/individual-localisation';

describe('AboutHearingsComponent', () => {
  let component: AboutHearingsComponent;
  let fixture: ComponentFixture<AboutHearingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutHearingsComponent, LocalisePipe ],
      providers: [
        IndividualLocalisation
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHearingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { AccessibilityComponent } from './accessibility.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('AccessibilityComponent', () => {
  let component: AccessibilityComponent;
  let fixture: ComponentFixture<AccessibilityComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccessibilityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


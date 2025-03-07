import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyPolicyComponent } from './privacy-policy.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolicyComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should print document', () => {
    spyOn(document, 'execCommand').and.callFake(() => { });
    component.printPage();
    expect(document.execCommand).toHaveBeenCalled();
  });
  it('should document command print failed and call windows.print', () => {
    spyOn(document, 'execCommand').and.throwError('error');
    spyOn(window, 'print').and.callFake(() => { });
    component.printPage();
    expect(window.print).toHaveBeenCalled();
  });
});

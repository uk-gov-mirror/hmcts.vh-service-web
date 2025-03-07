import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedBrowserComponent } from './unsupported-browser.component';
import { DeviceType } from 'src/app/modules/base-journey/services/device-type';

describe('UnsupportedBrowserComponent', () => {
  let component: UnsupportedBrowserComponent;
  let fixture: ComponentFixture<UnsupportedBrowserComponent>;
  let deviceTypeServiceSpy: jasmine.SpyObj<DeviceType>;
  const browserName = 'Opera';

  beforeEach(async(() => {
    deviceTypeServiceSpy = jasmine.createSpyObj<DeviceType>(['getBrowserName']);
    deviceTypeServiceSpy.getBrowserName.and.returnValue(browserName);
    TestBed.configureTestingModule({
      declarations: [ UnsupportedBrowserComponent ],
      providers: [
        { provide: DeviceType, useValue: deviceTypeServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initalise with browser information', () => {
    expect(component.supportedBrowsers.length).toBeGreaterThan(0);
    expect(component.browserName).toBe(browserName);
  });
});

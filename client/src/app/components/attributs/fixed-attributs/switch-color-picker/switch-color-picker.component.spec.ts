import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchColorPickerComponent } from './switch-color-picker.component';

describe('SwitchColorPickerComponent', () => {
  let component: SwitchColorPickerComponent;
  let fixture: ComponentFixture<SwitchColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchColorPickerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

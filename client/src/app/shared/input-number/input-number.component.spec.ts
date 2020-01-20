import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotkeyManagerService } from './../../core/services/hotkey/hotkey-manager.service';
import { InputNumberComponent } from './input-number.component';

describe('InputNumberComponent', () => {
  let component: InputNumberComponent;
  let fixture: ComponentFixture<InputNumberComponent>;
  let hotkeysService: HotkeyManagerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputNumberComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [HotkeyManagerService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumberComponent);
    component = fixture.componentInstance;
    hotkeysService = TestBed.get(HotkeyManagerService);
    component.min = 0;
    component.max = 10;
    fixture.detectChanges();
  });

  it('should not emit if value not in range', () => {
    component.onValueChange(20);
    expect(component.value).toBe(10);
  });
  it('should emit if value in range', () => {
    const spy = spyOn(component.valueChanged, 'emit');
    component.onValueChange(5);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit max value if when newValue is higher than range', () => {
    const spy = spyOn(component.valueChanged, 'emit');
    component.onValueChange(15);
    expect(spy).toHaveBeenCalledWith(10);
  });

  it('should emit min value if when newValue is lower than range', () => {
    const spy = spyOn(component.valueChanged, 'emit');
    component.onValueChange(-5);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should change hotkeys to available on blur', () => {
    component.onBlur();
    expect(hotkeysService.available).toBeTruthy();
  });

  it('should change hotkeys to not available on focus', () => {
    component.onFocus();
    expect(hotkeysService.available).toBeFalsy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

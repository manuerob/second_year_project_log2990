import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from './../../attributs.service';
import { FeatherControlsComponent } from './feather-controls.component';

import { MatDialogModule } from '@angular/material/dialog';

describe('FeatherControlsComponent', () => {
  let component: FeatherControlsComponent;
  let fixture: ComponentFixture<FeatherControlsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeatherControlsComponent, InputNumberComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [AttributsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set featherLength attribut on input value change', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newFeatherLength = 18;
    component.onFeatherLengthChange(newFeatherLength);
    expect(service.attributs.featherLength).toBe(newFeatherLength);
  });
  it('should set angle attribut on input value change', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newAngle = 18;
    component.onAngleChange(newAngle);
    expect(service.attributs.angle).toBe(newAngle);
  });
  it('should set width attribut to 2 on toggle change to true', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    component.checked = true;
    component.onWidthChange();
    expect(service.attributs.featherWidth).toBe(2);
  });
  it('should set width attribut to 1 on toggle change to false', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    component.checked = false;
    component.onWidthChange();
    expect(service.attributs.featherWidth).toBe(1);
  });
});

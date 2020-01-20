import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { DropdownListComponent } from './../../../../shared/custom-dropdown-list/custom-dropdown-list.component';
import { StampControlsComponent } from './stamp-controls.component';

describe('StampControlsComponent', () => {
  let component: StampControlsComponent;
  let fixture: ComponentFixture<StampControlsComponent>;
  let attributsService: AttributsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StampControlsComponent,
        InputNumberComponent,
        DropdownListComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampControlsComponent);
    component = fixture.componentInstance;
    attributsService = TestBed.get(AttributsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change scale factor value', () => {
    component.onScaleFactorChange(200);
    expect(attributsService.attributs.scaleFactor).toEqual(200);
  });

  it('should change stamp choice value', () => {
    component.onStampChoiceChange(200);
    expect(attributsService.attributs.stampChoice).toEqual(200);
  });

  it('should change angle value', () => {
    component.onAngleChange(200);
    expect(attributsService.attributs.angle).toEqual(200);
  });
});

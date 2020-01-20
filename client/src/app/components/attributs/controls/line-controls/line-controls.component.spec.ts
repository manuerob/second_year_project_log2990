import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { DropdownListComponent } from './../../../../shared/custom-dropdown-list/custom-dropdown-list.component';
import { LineControlsComponent } from './line-controls.component';

describe('LineControlsComponent', () => {
  let component: LineControlsComponent;
  let fixture: ComponentFixture<LineControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LineControlsComponent, InputNumberComponent, DropdownListComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update point joint diameter', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newDiameter = 6;
    component.onJointDiameterChange(newDiameter);
    expect(service.attributs.pointJointDiameter).toBe(newDiameter);
  });

  it('should update line pattern', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newPattern = 'dash_line';
    component.onlinePatternChange(newPattern);
    expect(service.attributs.linePattern).toBe(newPattern);
  });

  it('should update line junction type', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newJunctionType = 'circle';
    component.onJunctionTypeChange(newJunctionType);
    expect(service.attributs.junctionType).toBe(newJunctionType);
  });
});

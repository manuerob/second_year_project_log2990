import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { BucketControlsComponent } from './bucket-controls.component';

describe('BucketControlsComponent', () => {
  let component: BucketControlsComponent;
  let fixture: ComponentFixture<BucketControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketControlsComponent, InputNumberComponent, DropdownListComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update width', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newValue = 15;
    component.onStrokeWidthChange(newValue);
    expect(service.attributs.width).toBe(newValue);
  });

  it('should update tolerance', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newValue = 15;
    component.onToleranceChange(newValue);
    expect(service.attributs.tolerance).toBe(newValue);
  });

  it('should update plot type', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newValue = 'fill';
    component.onPlotTypeChange(newValue);
    expect(service.attributs.plotType).toBe(newValue);
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from '../../../../shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { PolygonControlsComponent } from './polygon-controls.component';

describe('RectangleControlsComponent', () => {
  let component: PolygonControlsComponent;
  let fixture: ComponentFixture<PolygonControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolygonControlsComponent, InputNumberComponent, DropdownListComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update width', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newWidth = 42;
    component.onWidthChange(newWidth);
    expect(service.attributs.width).toBe(newWidth);
  });

  it('should update type', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newPlotType = 'Outline';
    component.onPlotTypeChange(newPlotType);
    expect(service.attributs.plotType).toBe(newPlotType);
  });

  it('should update side count', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newSideCount = 6;
    component.onSideCountChange(newSideCount);
    expect(service.attributs.sideCount).toBe(newSideCount);
  });
});

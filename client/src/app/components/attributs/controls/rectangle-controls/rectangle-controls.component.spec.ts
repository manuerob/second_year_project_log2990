import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { AttributsService } from '../../attributs.service';
import { InputNumberComponent } from './../../../../shared/input-number/input-number.component';
import { RectangleControlsComponent } from './rectangle-controls.component';

describe('RectangleControlsComponent', () => {
  let component: RectangleControlsComponent;
  let fixture: ComponentFixture<RectangleControlsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [RectangleControlsComponent, InputNumberComponent, DropdownListComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
      providers: [{ provide: MatDialog, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleControlsComponent);
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
});

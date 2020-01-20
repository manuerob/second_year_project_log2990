import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { FixedAttributsComponent } from './fixed-attributs.component';
import { GridControlsComponent } from './grid-snap/grid-controls/grid-controls.component';
import { GridOpacityComponent } from './grid-snap/grid-controls/grid-opacity/grid-opacity.component';
import { GridSizesquareComponent } from './grid-snap/grid-controls/grid-sizesquare/grid-sizesquare.component';
import { GridSliderComponent } from './grid-snap/grid-slider/grid-slider.component';
import { GridSnapComponent } from './grid-snap/grid-snap.component';
import { SnapSliderComponent } from './grid-snap/snap-slider/snap-slider.component';
import { SnappingControlsComponent } from './grid-snap/snapping-controls/snapping-controls.component';
import { SwitchColorPickerComponent } from './switch-color-picker/switch-color-picker.component';
import { UndoRedoComponent } from './undo-redo/undo-redo.component';

describe('FixedAttributsComponent', () => {
  let component: FixedAttributsComponent;
  let fixture: ComponentFixture<FixedAttributsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FixedAttributsComponent,
        SwitchColorPickerComponent,
        GridSliderComponent,
        GridOpacityComponent,
        GridSnapComponent,
        GridSizesquareComponent,
        GridControlsComponent,
        InputNumberComponent,
        SnapSliderComponent,
        UndoRedoComponent,
        SnappingControlsComponent,
        DropdownListComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAttributsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsDetailsComponent } from '../attributs/attributs-details/attributs-details.component';
import { AttributsComponent } from '../attributs/attributs.component';
import { DisplayShapesComponent } from '../attributs/display-shapes/display-shapes.component';
import { FixedAttributsComponent } from '../attributs/fixed-attributs/fixed-attributs.component';
import { GridOpacityComponent } from '../attributs/fixed-attributs/grid-snap/grid-controls/grid-opacity/grid-opacity.component';
import { GridSizesquareComponent } from '../attributs/fixed-attributs/grid-snap/grid-controls/grid-sizesquare/grid-sizesquare.component';
import { GridSliderComponent } from '../attributs/fixed-attributs/grid-snap/grid-slider/grid-slider.component';
import { SnappingControlsComponent } from '../attributs/fixed-attributs/grid-snap/snapping-controls/snapping-controls.component';
import { SwitchColorPickerComponent } from '../attributs/fixed-attributs/switch-color-picker/switch-color-picker.component';
import { TabButtonComponent } from '../attributs/tab-button/tab-button.component';
import { GridControlsComponent } from './../attributs/fixed-attributs/grid-snap/grid-controls/grid-controls.component';
import { GridSnapComponent } from './../attributs/fixed-attributs/grid-snap/grid-snap.component';
import { SnapSliderComponent } from './../attributs/fixed-attributs/grid-snap/snap-slider/snap-slider.component';
import { UndoRedoComponent } from './../attributs/fixed-attributs/undo-redo/undo-redo.component';
import { ColorGradientComponent } from './color-gradient/color-gradient.component';
import { ColorHexadecimalComponent } from './color-hexadecimal/color-hexadecimal.component';
import { ColorOpacityComponent } from './color-opacity/color-opacity.component';
import { ColorPickerComponent } from './color-picker.component';
import { ColorSpectrumComponent } from './color-spectrum/color-spectrum.component';
import { PreviousColorsComponent } from './previous-colors/previous-colors.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SnapSliderComponent,
        GridControlsComponent,
        ColorPickerComponent,
        GridSnapComponent,
        PreviousColorsComponent,
        ColorGradientComponent,
        ColorOpacityComponent,
        ColorHexadecimalComponent,
        ColorSpectrumComponent,
        AttributsComponent,
        TabButtonComponent,
        FixedAttributsComponent,
        AttributsDetailsComponent,
        DisplayShapesComponent,
        SwitchColorPickerComponent,
        GridOpacityComponent,
        GridSizesquareComponent,
        GridSliderComponent,
        InputNumberComponent,
        UndoRedoComponent,
        SnappingControlsComponent,
        DropdownListComponent,
      ],
      imports: [
  BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize spectrum property in constructor', () => {
    expect(component.spectrum).toBeDefined();
  });

  it('should initialize color property in constructor', () => {
    expect(component.color).toBeDefined();
  });
});

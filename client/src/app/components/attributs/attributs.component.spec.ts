import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSlideToggleModule,
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'ngx-moment';
import { BrushControlsComponent } from 'src/app/components/attributs/controls/brush-controls/brush-controls.component';
import { Color } from 'src/app/core/models/color';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { CircleControlsComponent } from '../attributs/controls/circle-controls/circle-controls.component';
import { FeatherControlsComponent } from '../attributs/controls/feather-controls/feather-controls.component';
import { PenControlsComponent } from '../attributs/controls/pen-controls/pen-controls.component';
import { PencilControlsComponent } from '../attributs/controls/pencil-controls/pencil-controls.component';
import { RectangleControlsComponent } from '../attributs/controls/rectangle-controls/rectangle-controls.component';
import { SelectControlsComponent } from '../attributs/controls/select-controls/select-controls.component';
import { ColorGradientComponent } from './../color-picker/color-gradient/color-gradient.component';
import { ColorHexadecimalComponent } from './../color-picker/color-hexadecimal/color-hexadecimal.component';
import { ColorOpacityComponent } from './../color-picker/color-opacity/color-opacity.component';
import { ColorPickerComponent } from './../color-picker/color-picker.component';
import { ColorSpectrumComponent } from './../color-picker/color-spectrum/color-spectrum.component';
import { PreviousColorsComponent } from './../color-picker/previous-colors/previous-colors.component';
import { AttributsDetailsComponent } from './attributs-details/attributs-details.component';
import { AttributsComponent } from './attributs.component';
import { EraseControlsComponent } from './controls/erase-controls/erase-controls/erase-controls.component';
import { DisplayShapesComponent } from './display-shapes/display-shapes.component';
import { FixedAttributsComponent } from './fixed-attributs/fixed-attributs.component';
import { GridControlsComponent } from './fixed-attributs/grid-snap/grid-controls/grid-controls.component';
import { GridOpacityComponent } from './fixed-attributs/grid-snap/grid-controls/grid-opacity/grid-opacity.component';
import { GridSizesquareComponent } from './fixed-attributs/grid-snap/grid-controls/grid-sizesquare/grid-sizesquare.component';
import { GridSliderComponent } from './fixed-attributs/grid-snap/grid-slider/grid-slider.component';
import { GridSnapComponent } from './fixed-attributs/grid-snap/grid-snap.component';
import { SnapSliderComponent } from './fixed-attributs/grid-snap/snap-slider/snap-slider.component';
import { SnappingControlsComponent } from './fixed-attributs/grid-snap/snapping-controls/snapping-controls.component';
import { SwitchColorPickerComponent } from './fixed-attributs/switch-color-picker/switch-color-picker.component';
import { UndoRedoComponent } from './fixed-attributs/undo-redo/undo-redo.component';
import { TabButtonComponent } from './tab-button/tab-button.component';

describe('AttributsComponent', () => {
  let component: AttributsComponent;
  let fixture: ComponentFixture<AttributsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AttributsComponent,
        GridControlsComponent,
        TabButtonComponent,
        FixedAttributsComponent,
        ColorHexadecimalComponent,
        ColorSpectrumComponent,
        PreviousColorsComponent,
        ColorGradientComponent,
        SelectControlsComponent,
        RectangleControlsComponent,
        CircleControlsComponent,
        GridSnapComponent,
        SnapSliderComponent,
        PenControlsComponent,
        PencilControlsComponent,
        FeatherControlsComponent,
        BrushControlsComponent,
        ColorOpacityComponent,
        ColorPickerComponent,
        ColorGradientComponent,
        AttributsDetailsComponent,
        DisplayShapesComponent,
        SwitchColorPickerComponent,
        GridOpacityComponent,
        GridSizesquareComponent,
        GridSliderComponent,
        UndoRedoComponent,
        InputNumberComponent,
        DropdownListComponent,
        EraseControlsComponent,
        SnappingControlsComponent,
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatDialogModule,
        MomentModule,
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            SelectControlsComponent,
            RectangleControlsComponent,
            CircleControlsComponent,
            PenControlsComponent,
            PencilControlsComponent,
            FeatherControlsComponent,
            BrushControlsComponent,
            EraseControlsComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should modify to the selectedColor', () => {
    const newColor = new Color();
    component.onSelectColor(newColor);
    expect(component.showColorPicker).toEqual(true);
    expect(component.modifiedColor).toEqual(newColor);
  });
});

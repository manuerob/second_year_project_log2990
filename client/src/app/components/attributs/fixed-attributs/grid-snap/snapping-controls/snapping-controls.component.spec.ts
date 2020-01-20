import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTabsModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'ngx-moment';
import { AppComponent } from 'src/app/app.component';
import { CanvasComponent } from 'src/app/components/canvas/canvas.component';
import { GridComponent } from 'src/app/components/canvas/grid/grid.component';
import { ColorGradientComponent } from 'src/app/components/color-picker/color-gradient/color-gradient.component';
import { ColorHexadecimalComponent } from 'src/app/components/color-picker/color-hexadecimal/color-hexadecimal.component';
import { ColorOpacityComponent } from 'src/app/components/color-picker/color-opacity/color-opacity.component';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { ColorSpectrumComponent } from 'src/app/components/color-picker/color-spectrum/color-spectrum.component';
import { PreviousColorsComponent } from 'src/app/components/color-picker/previous-colors/previous-colors.component';
import { EditDrawingComponent } from 'src/app/components/edit-drawing/edit-drawing.component';
import { TagsComponent } from 'src/app/components/edit-drawing/tags/tags.component';
import { SaveDrawingComponent } from 'src/app/components/save-drawing/save-drawing.component';
import { ButtonComponent } from 'src/app/components/toolbar/button/button.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { WelcomeWindowComponent } from 'src/app/components/welcome-window/welcome-window.component';
import { SafePipe } from 'src/app/core/pipes/safe-html/safe.pipe';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { HotkeyManagerService } from 'src/app/core/services/hotkey/hotkey-manager.service';
import { BrushHandlerService } from 'src/app/core/services/shape-service/brush-handler/brush-handler.service';
import { EllipseHandlerService } from 'src/app/core/services/shape-service/ellipse-handler/ellipse-handler.service';
import { EraseHandlerService } from 'src/app/core/services/shape-service/erase-handler/erase-handler.service';
import { LineHandlerService } from 'src/app/core/services/shape-service/line-handler/line-handler.service';
import { PenHandlerService } from 'src/app/core/services/shape-service/pen-handler/pen-handler.service';
import { PencilHandlerService } from 'src/app/core/services/shape-service/pencil-handler/pencil-handler.service';
import { PolygonHandlerService } from 'src/app/core/services/shape-service/polygon-handler/polygon-handler.service';
import { RectangleHandlerService } from 'src/app/core/services/shape-service/rectangle-handler/rectangle-handler.service';
import { SelectHandlerService } from 'src/app/core/services/shape-service/select-handler/select-handler.service';
import { SnappingService } from 'src/app/core/services/shape-service/select-handler/snapping/snapping.service';
import { ShapeHandlerService } from 'src/app/core/services/shape-service/shape-handler/shape-handler.service';
import { StampHandlerService } from 'src/app/core/services/shape-service/stamp-handler/stamp-handler.service';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { DEFAULT_SNAPPING_POINT_CHOICES } from '../../../../../../../../common/constants/constants';
import { AttributsDetailsComponent } from '../../../attributs-details/attributs-details.component';
import { AttributsComponent } from '../../../attributs.component';
import { BrushControlsComponent } from '../../../controls/brush-controls/brush-controls.component';
import { CircleControlsComponent } from '../../../controls/circle-controls/circle-controls.component';
import { EraseControlsComponent } from '../../../controls/erase-controls/erase-controls/erase-controls.component';
import { FeatherControlsComponent } from '../../../controls/feather-controls/feather-controls.component';
import { PenControlsComponent } from '../../../controls/pen-controls/pen-controls.component';
import { PencilControlsComponent } from '../../../controls/pencil-controls/pencil-controls.component';
import { RectangleControlsComponent } from '../../../controls/rectangle-controls/rectangle-controls.component';
import { SelectControlsComponent } from '../../../controls/select-controls/select-controls.component';
import { DisplayShapesComponent } from '../../../display-shapes/display-shapes.component';
import { TabButtonComponent } from '../../../tab-button/tab-button.component';
import { FixedAttributsComponent } from '../../fixed-attributs.component';
import { SwitchColorPickerComponent } from '../../switch-color-picker/switch-color-picker.component';
import { UndoRedoComponent } from '../../undo-redo/undo-redo.component';
import { GridOpacityComponent } from '../grid-controls/grid-opacity/grid-opacity.component';
import { GridSizesquareComponent } from '../grid-controls/grid-sizesquare/grid-sizesquare.component';
import { GridSliderComponent } from '../grid-slider/grid-slider.component';
import { GridControlsComponent } from './../grid-controls/grid-controls.component';
import { GridSnapComponent } from './../grid-snap.component';
import { SnapSliderComponent } from './../snap-slider/snap-slider.component';
import { SnappingControlsComponent } from './snapping-controls.component';

describe('SnappingControlsComponent', () => {
  let component: SnappingControlsComponent;
  let fixture: ComponentFixture<SnappingControlsComponent>;
  let snappingService: SnappingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
  BrowserModule,
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSliderModule,
        MatDialogModule,
        MatCardModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatIconModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatOptionModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatInputModule,
        MatFormFieldModule,
        MatPaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MomentModule,
      ],
      declarations: [
        AppComponent,
        GridControlsComponent,
        GridComponent,
        ToolbarComponent,
        AttributsComponent,
        SafePipe,
        CanvasComponent,
        ButtonComponent,
        AttributsDetailsComponent,
        DisplayShapesComponent,
        ColorPickerComponent,
        ColorGradientComponent,
        ColorOpacityComponent,
        UndoRedoComponent,
        ColorSpectrumComponent,
        GridSnapComponent,
        ColorHexadecimalComponent,
        PreviousColorsComponent,
        SnapSliderComponent,
        TagsComponent,
        SwitchColorPickerComponent,
        TabButtonComponent,
        FixedAttributsComponent,
        RectangleControlsComponent,
        CircleControlsComponent,
        PenControlsComponent,
        SelectControlsComponent,
        PencilControlsComponent,
        FeatherControlsComponent,
        BrushControlsComponent,
        WelcomeWindowComponent,
        SaveDrawingComponent,
        EditDrawingComponent,
        GridComponent,
        InputNumberComponent,
        DropdownListComponent,
        GridOpacityComponent,
        GridSizesquareComponent,
        GridSliderComponent,
        CustomButtonComponent,
        EraseControlsComponent,
        SnappingControlsComponent,
      ],
      providers: [
        BrushHandlerService,
        LineHandlerService,
        PencilHandlerService,
        PenHandlerService,
        PolygonHandlerService,
        ShapeHandlerService,
        StampHandlerService,
        RectangleHandlerService,
        Renderer2,
        EllipseHandlerService,
        SelectHandlerService,
        HotkeyManagerService,
        EraseHandlerService,
        DrawingService,
        SnappingService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnappingControlsComponent);
    component = fixture.componentInstance;
    snappingService = TestBed.get(SnappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take the default snapping choice on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.snappingPointChoices).toEqual(DEFAULT_SNAPPING_POINT_CHOICES);
  });

  it('should change width value', () => {
    const newValue = 'LEFT_BUTTON';
    component.onSnappinPointChange(newValue);
    expect(snappingService.snappingPoint).toEqual(newValue);
  });
});

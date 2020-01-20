import { CommonModule } from '@angular/common';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatStepperModule,
} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { AppComponent } from './app.component';
import { AttributsDetailsComponent } from './components/attributs/attributs-details/attributs-details.component';
import { AttributsComponent } from './components/attributs/attributs.component';
import { BrushControlsComponent } from './components/attributs/controls/brush-controls/brush-controls.component';
import { CircleControlsComponent } from './components/attributs/controls/circle-controls/circle-controls.component';
import { FeatherControlsComponent } from './components/attributs/controls/feather-controls/feather-controls.component';
import { PenControlsComponent } from './components/attributs/controls/pen-controls/pen-controls.component';
import { PencilControlsComponent } from './components/attributs/controls/pencil-controls/pencil-controls.component';
import { RectangleControlsComponent } from './components/attributs/controls/rectangle-controls/rectangle-controls.component';
import { SelectControlsComponent } from './components/attributs/controls/select-controls/select-controls.component';
import { DisplayShapesComponent } from './components/attributs/display-shapes/display-shapes.component';
import { FixedAttributsComponent } from './components/attributs/fixed-attributs/fixed-attributs.component';
import { GridOpacityComponent } from './components/attributs/fixed-attributs/grid-snap/grid-controls/grid-opacity/grid-opacity.component';
// tslint:disable-next-line: max-line-length
import { GridSizesquareComponent } from './components/attributs/fixed-attributs/grid-snap/grid-controls/grid-sizesquare/grid-sizesquare.component';
import { GridSliderComponent } from './components/attributs/fixed-attributs/grid-snap/grid-slider/grid-slider.component';
import { SwitchColorPickerComponent } from './components/attributs/fixed-attributs/switch-color-picker/switch-color-picker.component';
import { UndoRedoComponent } from './components/attributs/fixed-attributs/undo-redo/undo-redo.component';
import { TabButtonComponent } from './components/attributs/tab-button/tab-button.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorGradientComponent } from './components/color-picker/color-gradient/color-gradient.component';
import { ColorHexadecimalComponent } from './components/color-picker/color-hexadecimal/color-hexadecimal.component';
import { ColorOpacityComponent } from './components/color-picker/color-opacity/color-opacity.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSpectrumComponent } from './components/color-picker/color-spectrum/color-spectrum.component';
import { PreviousColorsComponent } from './components/color-picker/previous-colors/previous-colors.component';
import { EditDrawingComponent } from './components/edit-drawing/edit-drawing.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { ButtonComponent } from './components/toolbar/button/button.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { DrawingService } from './core/services/drawing/drawing.service';
import { HotkeyManagerService } from './core/services/hotkey/hotkey-manager.service';

import { GridComponent } from './components/canvas/grid/grid.component';
import { TagsComponent } from './components/edit-drawing/tags/tags.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { EraseControlsComponent } from './components/attributs/controls/erase-controls/erase-controls/erase-controls.component';
import { GridControlsComponent } from './components/attributs/fixed-attributs/grid-snap/grid-controls/grid-controls.component';
import { GridSnapComponent } from './components/attributs/fixed-attributs/grid-snap/grid-snap.component';
import { SnapSliderComponent } from './components/attributs/fixed-attributs/grid-snap/snap-slider/snap-slider.component';
import { SnappingControlsComponent } from './components/attributs/fixed-attributs/grid-snap/snapping-controls/snapping-controls.component';
import { SafePipe } from './core/pipes/safe-html/safe.pipe';
import { BrushHandlerService } from './core/services/shape-service/brush-handler/brush-handler.service';
import { EllipseHandlerService } from './core/services/shape-service/ellipse-handler/ellipse-handler.service';
import { EraseHandlerService } from './core/services/shape-service/erase-handler/erase-handler.service';
import { LineHandlerService } from './core/services/shape-service/line-handler/line-handler.service';
import { PenHandlerService } from './core/services/shape-service/pen-handler/pen-handler.service';
import { PencilHandlerService } from './core/services/shape-service/pencil-handler/pencil-handler.service';
import { PolygonHandlerService } from './core/services/shape-service/polygon-handler/polygon-handler.service';
import { RectangleHandlerService } from './core/services/shape-service/rectangle-handler/rectangle-handler.service';
import { SelectHandlerService } from './core/services/shape-service/select-handler/select-handler.service';
import { SnappingService } from './core/services/shape-service/select-handler/snapping/snapping.service';
import { ShapeHandlerService } from './core/services/shape-service/shape-handler/shape-handler.service';
import { StampHandlerService } from './core/services/shape-service/stamp-handler/stamp-handler.service';
import { CustomButtonComponent } from './shared/custom-button/custom-button.component';
import { DropdownListComponent } from './shared/custom-dropdown-list/custom-dropdown-list.component';

describe('AppComponent', () => {
  let fakeHotkeyManager: HotkeyManagerService;
  let component: AppComponent;

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
        SnapSliderComponent,
        GridSnapComponent,
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
        ColorHexadecimalComponent,
        PreviousColorsComponent,
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
    });
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fakeHotkeyManager = TestBed.get(HotkeyManagerService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should update hotkeyManager', () => {
    const fakeEvent = new KeyboardEvent('test');
    const spy = spyOn(fakeHotkeyManager, 'udpateHotkeys');
    component.onKeyDown(fakeEvent);
    expect(spy).toHaveBeenCalled();
  });
});

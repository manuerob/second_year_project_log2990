import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTooltipModule
} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageServiceModule } from 'angular-webstorage-service';
import 'moment/locale/fr';
import { MomentModule } from 'ngx-moment';
import { LineHandlerService } from 'src/app/core/services/shape-service/line-handler/line-handler.service';
import { PolygonHandlerService } from 'src/app/core/services/shape-service/polygon-handler/polygon-handler.service';
import { SelectHandlerService } from 'src/app/core/services/shape-service/select-handler/select-handler.service';
import { StampHandlerService } from 'src/app/core/services/shape-service/stamp-handler/stamp-handler.service';
import { TextHandlerService } from 'src/app/core/services/shape-service/text-handler/text-handler.service';
import { AppComponent } from './app.component';
import { AttributsDetailsComponent } from './components/attributs/attributs-details/attributs-details.component';
import { AttributsComponent } from './components/attributs/attributs.component';
import { BrushControlsComponent } from './components/attributs/controls/brush-controls/brush-controls.component';
import { BucketControlsComponent } from './components/attributs/controls/bucket-controls/bucket-controls.component';
import { CircleControlsComponent } from './components/attributs/controls/circle-controls/circle-controls.component';
import { EraseControlsComponent } from './components/attributs/controls/erase-controls/erase-controls/erase-controls.component';
import { FeatherControlsComponent } from './components/attributs/controls/feather-controls/feather-controls.component';
import { LineControlsComponent } from './components/attributs/controls/line-controls/line-controls.component';
import { PenControlsComponent } from './components/attributs/controls/pen-controls/pen-controls.component';
import { PencilControlsComponent } from './components/attributs/controls/pencil-controls/pencil-controls.component';
import { PipetteControlsComponent } from './components/attributs/controls/pipette-controls/pipette-controls.component';
import { PolygonControlsComponent } from './components/attributs/controls/polygon-controls/polygon-controls.component';
import { RectangleControlsComponent } from './components/attributs/controls/rectangle-controls/rectangle-controls.component';
import { SelectControlsComponent } from './components/attributs/controls/select-controls/select-controls.component';
import { SpraypaintControlsComponent } from './components/attributs/controls/spraypaint-controls/spraypaint-controls.component';
import { StampControlsComponent } from './components/attributs/controls/stamp-controls/stamp-controls.component';
import { TextControlsComponent } from './components/attributs/controls/text-controls/text-controls.component';
import { DisplayShapesComponent } from './components/attributs/display-shapes/display-shapes.component';
import { FixedAttributsComponent } from './components/attributs/fixed-attributs/fixed-attributs.component';
import { GridControlsComponent } from './components/attributs/fixed-attributs/grid-snap/grid-controls/grid-controls.component';
import { GridOpacityComponent } from './components/attributs/fixed-attributs/grid-snap/grid-controls/grid-opacity/grid-opacity.component';
// tslint:disable-next-line: max-line-length
import { GridSizesquareComponent } from './components/attributs/fixed-attributs/grid-snap/grid-controls/grid-sizesquare/grid-sizesquare.component';
import { GridSliderComponent } from './components/attributs/fixed-attributs/grid-snap/grid-slider/grid-slider.component';
import { GridSnapComponent } from './components/attributs/fixed-attributs/grid-snap/grid-snap.component';
import { SnapSliderComponent } from './components/attributs/fixed-attributs/grid-snap/snap-slider/snap-slider.component';
import { SnappingControlsComponent } from './components/attributs/fixed-attributs/grid-snap/snapping-controls/snapping-controls.component';
import { SwitchColorPickerComponent } from './components/attributs/fixed-attributs/switch-color-picker/switch-color-picker.component';
import { UndoRedoComponent } from './components/attributs/fixed-attributs/undo-redo/undo-redo.component';
import { TabButtonComponent } from './components/attributs/tab-button/tab-button.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { GridComponent } from './components/canvas/grid/grid.component';
import { ColorGradientComponent } from './components/color-picker/color-gradient/color-gradient.component';
import { ColorHexadecimalComponent } from './components/color-picker/color-hexadecimal/color-hexadecimal.component';
import { ColorOpacityComponent } from './components/color-picker/color-opacity/color-opacity.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSpectrumComponent } from './components/color-picker/color-spectrum/color-spectrum.component';
import { PreviousColorsComponent } from './components/color-picker/previous-colors/previous-colors.component';
import { DrawingComponent } from './components/drawing-creator/drawing/drawing.component';
import { EditDrawingComponent } from './components/edit-drawing/edit-drawing.component';
import { TagsComponent } from './components/edit-drawing/tags/tags.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { ButtonComponent } from './components/toolbar/button/button.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserGuideWindowComponent } from './components/user-guide/user-guide-window/user-guide-window.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { SafePipe } from './core/pipes/safe-html/safe.pipe';
import { DrawingService } from './core/services/drawing/drawing.service';
import { BrushHandlerService } from './core/services/shape-service/brush-handler/brush-handler.service';
import { EllipseHandlerService } from './core/services/shape-service/ellipse-handler/ellipse-handler.service';
import { EraseHandlerService } from './core/services/shape-service/erase-handler/erase-handler.service';
import { PenHandlerService } from './core/services/shape-service/pen-handler/pen-handler.service';
import { PencilHandlerService } from './core/services/shape-service/pencil-handler/pencil-handler.service';
import { PipetteHandlerService } from './core/services/shape-service/pipette-handler/pipette-handler.service';
import { RectangleHandlerService } from './core/services/shape-service/rectangle-handler/rectangle-handler.service';
import { ShapeHandlerService } from './core/services/shape-service/shape-handler/shape-handler.service';
import { CustomButtonComponent } from './shared/custom-button/custom-button.component';
import { DropdownListComponent } from './shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from './shared/input-number/input-number.component';
@NgModule({
  declarations: [
    AttributsComponent,
    AppComponent,
    ToolbarComponent,
    DrawingComponent,
    CanvasComponent,
    AttributsDetailsComponent,
    DisplayShapesComponent,
    ColorPickerComponent,
    UserGuideWindowComponent,
    ColorGradientComponent,
    ColorOpacityComponent,
    ColorSpectrumComponent,
    InputNumberComponent,
    ColorHexadecimalComponent,
    PreviousColorsComponent,
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
    ButtonComponent,
    SaveDrawingComponent,
    EditDrawingComponent,
    GridComponent,
    TagsComponent,
    GridSliderComponent,
    GridOpacityComponent,
    GridControlsComponent,
    GridSizesquareComponent,
    DropdownListComponent,
    LineControlsComponent,
    PolygonControlsComponent,
    PipetteControlsComponent,
    CustomButtonComponent,
    SafePipe,
    StampControlsComponent,
    TextControlsComponent,
    ExportDrawingComponent,
    UndoRedoComponent,
    EraseControlsComponent,
    SpraypaintControlsComponent,
    SnapSliderComponent,
    SnappingControlsComponent,
    BucketControlsComponent,
    GridSnapComponent,
  ],
  imports: [
    MatAutocompleteModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSliderModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule,
    MatTabsModule,
    MatOptionModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    StorageServiceModule,
    MatStepperModule,
    MatSlideToggleModule,
    MomentModule,
  ],
  providers: [
    DrawingService,
    BrushHandlerService,
    LineHandlerService,
    PencilHandlerService,
    PenHandlerService,
    PolygonHandlerService,
    ShapeHandlerService,
    StampHandlerService,
    RectangleHandlerService,
    EllipseHandlerService,
    SelectHandlerService,
    PipetteHandlerService,
    TextHandlerService,
    EraseHandlerService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SelectControlsComponent,
    RectangleControlsComponent,
    CircleControlsComponent,
    PenControlsComponent,
    WelcomeWindowComponent,
    PencilControlsComponent,
    FeatherControlsComponent,
    BrushControlsComponent,
    DrawingComponent,
    ColorPickerComponent,
    UserGuideWindowComponent,
    SaveDrawingComponent,
    EditDrawingComponent,
    LineControlsComponent,
    StampControlsComponent,
    PolygonControlsComponent,
    PipetteControlsComponent,
    TextControlsComponent,
    ExportDrawingComponent,
    EraseControlsComponent,
    SpraypaintControlsComponent,
    BucketControlsComponent,
  ],
})
export class AppModule { }

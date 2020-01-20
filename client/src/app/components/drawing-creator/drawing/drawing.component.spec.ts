import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { DrawingComponent } from './drawing.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ColorPickerComponent } from './../../color-picker/color-picker.component';

import { ColorHexadecimalComponent } from '../../color-picker/color-hexadecimal/color-hexadecimal.component';
import { ColorOpacityComponent } from '../../color-picker/color-opacity/color-opacity.component';
import { ColorSpectrumComponent } from '../../color-picker/color-spectrum/color-spectrum.component';
import { CustomButtonComponent } from './../../../shared/custom-button/custom-button.component';
import { ColorGradientComponent } from './../../color-picker/color-gradient/color-gradient.component';
import { PreviousColorsComponent } from './../../color-picker/previous-colors/previous-colors.component';

import SpyObj = jasmine.SpyObj;
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { DrawingService } from '../../../core/services/drawing/drawing.service';

describe('DrawingComponent', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;
  let spy: SpyObj<MatDialogRef<DrawingComponent>>;
  let fakeSaveDrawing: SaveDrawingService;
  let fakeSvgsService: DisplayShapesService;
  beforeEach(() => {
    spy = jasmine.createSpyObj('MatDialogRef<DrawingComponent>', ['close']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingComponent,
        ColorPickerComponent,
        ColorOpacityComponent,
        ColorHexadecimalComponent,
        ColorGradientComponent,
        ColorSpectrumComponent,
        PreviousColorsComponent,
        CustomButtonComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: spy }, DrawingService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    fakeSaveDrawing = TestBed.get(SaveDrawingService);
    fakeSvgsService = TestBed.get(DisplayShapesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and call close', () => {
    component.onCreate();
    expect(spy.close.calls.count()).toBe(1);
  });

  it('should try to submit but failed', () => {
    const service: DrawingService = TestBed.get(DrawingService);

    service.form.patchValue({
      fileWidth: -1,
    });
    component.onCreate();
    expect(spy.close.calls.count()).toBe(0);
  });

  it('should restrict saving', () => {
    spyOn(fakeSvgsService, 'isEmpty').and.returnValue(true);
    fakeSaveDrawing.currentGraphSaved = true;
    expect(component.canDraw()).toBeFalsy();
  });

  it('should restrict saving 2', () => {
    spyOn(fakeSvgsService, 'isEmpty').and.returnValue(true);
    fakeSaveDrawing.currentGraphSaved = false;
    expect(component.canDraw()).toBeFalsy();
  });

  it('should allow saving', () => {
    // tslint:disable-next-line: no-any
    fakeSaveDrawing = {} as any;
    expect(component.canDraw()).toBeFalsy();
  });

});

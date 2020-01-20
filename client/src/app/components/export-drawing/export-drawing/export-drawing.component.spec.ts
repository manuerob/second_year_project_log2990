import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatChipInputEvent,
  MatChipsModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipe } from 'src/app/core/pipes/safe-html/safe.pipe';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { SaveDrawingComponent } from '../../save-drawing/save-drawing.component';
import { SaveDrawingService } from '../../save-drawing/service/save-drawing.service';
import { ExportDrawingService } from '../export-drawing-service/export-drawing.service';
import { ExportDrawingComponent } from './export-drawing.component';

describe('ExportDrawingComponent', () => {
  let component: ExportDrawingComponent;
  let fixture: ComponentFixture<ExportDrawingComponent>;
  let dialogSpy: jasmine.Spy;
  let exported: ExportDrawingService;
  const dialogMock = {
    close: () => {
      return;
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDrawingComponent, SaveDrawingComponent, SafePipe, CustomButtonComponent],
      imports: [
        MatAutocompleteModule,
        FormsModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatOptionModule,
        HttpClientTestingModule,
      ],
      providers: [
        SaveDrawingService,
        DrawingService,
        ExportDrawingService,
        { provide: MatDialogRef, useValue: dialogMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(DrawingService).canvasRef = { nativeElement: 'any' };
    TestBed.get(ExportDrawingService).canvasRef = { nativeElement: 'any' };
    fixture = TestBed.createComponent(ExportDrawingComponent);
    exported = TestBed.get(ExportDrawingService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // tslint:disable-next-line: no-string-literal
    dialogSpy = spyOn(component['dialogRef'], 'close').and.callFake(dialogMock.close);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    component.onClose();
    expect(dialogSpy).toHaveBeenCalled();
  });
  it('should allow Export', () => {
    component.drawing = true;
    component.fileName.setValue('onetitle');
    expect(component.canExport).toBeTruthy();
    component.drawing = false;
    fixture.detectChanges();
    expect(component.canExport()).toBeTruthy();
  });

  it('should add tags', () => {
    expect(component.tags).toEqual([]);
    const event1 = { value: 'onetag1' };
    component.add(event1 as MatChipInputEvent);
    expect(component.tags).toEqual(['onetag1']);

  });

  it('should remove tag correctly ', () => {
    expect(component.tags).toEqual([]);
    const event = { value: 'onetag1' };
    component.add(event as MatChipInputEvent);
    expect(component.tags).toEqual(['onetag1']);

    const tag = component.tags[0];
    component.remove(tag);
    expect(component.tags.length).toEqual(0);
  });

  it('canExport should return true while not drawing', () => {
    component.drawing = false;
    component.canExport();
    expect(component.canExport()).toBeTruthy();
  });

  it('should disallow Export', () => {
    component.drawing = true;
    component.fileName.setValue('');
    component.canExport();
    expect(component.canExport()).toBeFalsy();
  });

  it('should call #exportToSvg on exportToSvg', () => {
    const spy = spyOn(exported, 'exportToSvg');
    component.onExportSvg();
    expect(spy).toHaveBeenCalled();
  });

  it('should call #exportToJpeg on exportToJpeg', () => {
    const spy = spyOn(exported, 'exportToJpeg');
    component.onExportJpeg();
    expect(spy).toHaveBeenCalled();
  });

  it('should call #exportToBmp on exportToBmp', () => {
    const spy = spyOn(exported, 'exportToBmp');
    component.onExportBmp();
    expect(spy).toHaveBeenCalled();
  });

  it('should call #exportToPng on exportToPng', () => {
    const spy = spyOn(exported, 'exportToPng');
    component.onExportPng();
    expect(spy).toHaveBeenCalled();
  });

  it('throw error message if filename has error on Export to Png', () => {
    const spy = spyOn(exported, 'exportToPng');
    const spy1 = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.onExportPng();
    spyOn(XMLSerializer.prototype, 'serializeToString');
    const data = 'not able to export';
    expect(spy).toHaveBeenCalled();
    expect(component.error).toBe(data);
    expect(spy1).toHaveBeenCalled();
  });

  it('throw error message if filename has error on Export to Bmp', () => {
    const spy = spyOn(exported, 'exportToBmp');
    const spy1 = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.onExportBmp();
    spyOn(XMLSerializer.prototype, 'serializeToString');
    const data = 'not able to export';
    expect(spy).toHaveBeenCalled();
    expect(component.error).toBe(data);
    expect(spy1).toHaveBeenCalled();
  });

  it('throw error message if filename has error on Export to Svg', () => {
    const spy = spyOn(exported, 'exportToSvg');
    const spy1 = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.onExportSvg();
    spyOn(XMLSerializer.prototype, 'serializeToString');
    const data = 'not able to export';
    expect(spy).toHaveBeenCalled();
    expect(component.error).toBe(data);
    expect(spy1).toHaveBeenCalled();
  });

  it('throw error message if filename has error on Export to Jpeg', () => {
    const spy = spyOn(exported, 'exportToJpeg');
    const spy1 = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.onExportJpeg();
    spyOn(XMLSerializer.prototype, 'serializeToString');
    const data = 'not able to export';
    expect(spy).toHaveBeenCalled();
    expect(component.error).toBe(data);
    expect(spy1).toHaveBeenCalled();
  });

  it('display the error message on getError ', () => {
    const spy = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.getErrorMessage();
    expect(spy).toHaveBeenCalled();
  });

  it('display an empty error message on getError ', () => {
    const spy = spyOn(component.fileName, 'hasError').and.returnValue(false);
    component.getErrorMessage();
    const data = '';
    expect(spy).toHaveBeenCalled();
    expect(component.error).toBe(data);
  });

});

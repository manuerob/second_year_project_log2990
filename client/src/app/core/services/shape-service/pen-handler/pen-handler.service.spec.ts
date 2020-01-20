import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { SaveDrawingService } from '../../../../components/save-drawing/service/save-drawing.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';

import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { Color } from 'src/app/core/models/color';
import { PenObject } from 'src/app/core/models/shapes/pen-object';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { PenHandlerService } from './pen-handler.service';

const PRIMARYCOLOR: Color = new Color('#000000');

describe('PenHandlerService', () => {
  let service: PenHandlerService;
  let fakeShapeDepedency: ShapeDependencyService;
  let fakeDrawingService: DrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        PenHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
        HttpClient,
        HttpHandler,
      ],
    }),
  );

  beforeEach(() => {
    service = TestBed.get(PenHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    service.canvasRef = { nativeElement: 'any' };
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
  });
  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(PenHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate speed', () => {
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'layerX').and.returnValue(0);
    spyOnProperty(event, 'layerY').and.returnValue(0);

    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });

    service.time = 0;
    service.shape = new PenObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 0, y: 0 },
      FAKE_ATTRIBUTS.width,
    );
    service.shape.linePoints = [{ x: 0, y: 0 }];
    expect(service.calculateSpeed(event, 1)).toBe(0);
  });

  it('End the pen on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.startingPoint = { x: 20, y: 107 };

    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });

    service.shape = new PenObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
    );
    service.shape.addPoint({ x: 25, y: 100 });
    spyOn(service, 'endShape');
    spyOn(service.shape, 'end').and.callThrough();
    service.onMouseUp(event);
    expect(service.shape.size).toEqual({
      x: 5,
      y: 7,
    });
    expect(service.shape.pointsData).toEqual('0,7 0,7 5,0 ');
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 20, 100)');

    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });

    expect(service.shape.end).toHaveBeenCalled();
    expect(service.endShape).toHaveBeenCalled();
  });
  it('Do nothing on mouseUp while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');

    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });

    spyOn(service, 'endShape');
    service.onMouseUp(event);
    expect(service.shape).not.toBeTruthy();
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).not.toHaveBeenCalled();
  });

  it('should create pen object on mouse down if is not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    service.onMouseDown(event);
    expect(service.shape).toBeDefined();
    expect(fakeDrawingService.isDrawing).toBeTruthy();
  });

  it('should throw error on mouse down if is drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = true;
    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected click while drawing'));

    expect(service.shape).not.toBeDefined();
  });

  it('should not add pen strokes if is not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOn(service, 'addPenStroke');
    fakeDrawingService.isDrawing = false;
    service.onMouseMove(event);
    expect(service.addPenStroke).not.toHaveBeenCalled();
  });

  it('should add pen strokes if is drawing', () => {
    const event1: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event1, 'layerX').and.returnValue(1);
    spyOnProperty(event1, 'layerY').and.returnValue(1);
    fakeDrawingService.isDrawing = false;
    service.onMouseDown(event1);
    expect(fakeDrawingService.isDrawing).toBeTruthy();

    const event2: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event2, 'layerX').and.returnValue(5);
    spyOnProperty(event2, 'layerY').and.returnValue(129);
    spyOn(service, 'addPenStroke');
    service.onMouseMove(event2);
    expect(service.addPenStroke).toHaveBeenCalled();
  });

  it('should clamp value if greater than maxWidth', () => {
    const newStrokeWidth = 15;
    expect(service.clamp(newStrokeWidth)).toBe(12);
  });

  it('should clamp value if smaller than minWidth', () => {
    const newStrokeWidth = 0;
    expect(service.clamp(newStrokeWidth)).toBe(1);
  });

  it('should not clamp value if in width interval', () => {
    const newStrokeWidth = 7;
    expect(service.clamp(newStrokeWidth)).toBe(7);
  });

  it('should reduce difference between strokewidths', () => {
    const currentTestWidth = 10;
    const expectedTestWidth = (10 - 2) * 0.15 + 2;
    service.previousWidth = 2;
    expect(service.smoothLine(currentTestWidth)).toBe(expectedTestWidth);
  });

  it('should stop drawing on mouse up', () => {
    const event1: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event1, 'layerX').and.returnValue(1);
    spyOnProperty(event1, 'layerY').and.returnValue(1);
    fakeDrawingService.isDrawing = false;
    service.onMouseDown(event1);

    const event: MouseEvent = new MouseEvent('mouseUp');
    spyOn(service, 'setRenderer');
    service.onMouseUp(event);
    expect(service.setRenderer).toHaveBeenCalled();
    expect(fakeDrawingService.isDrawing).toBeFalsy();
  });
});

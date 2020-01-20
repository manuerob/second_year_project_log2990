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
import { SpraypaintObject } from 'src/app/core/models/shapes/spraypaint-object';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { SpraypaintHandlerService } from './spraypaint-handler.service';

const PRIMARYCOLOR: Color = new Color('#000000');

describe('SpraypaintHandlerService', () => {
  let service: SpraypaintHandlerService;
  let fakeShapeDepedency: ShapeDependencyService;
  let fakeDrawingService: DrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        SpraypaintHandlerService,
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
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(SpraypaintHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
  });

  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(SpraypaintHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should do nothing on mouseUp while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');

    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });

    spyOn(service, 'endShape');
    service.onMouseUp(event);
    expect(service.shape).not.toBeTruthy();
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).not.toHaveBeenCalled();
  });

  it('should throw error on mouse down if is drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = true;
    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected click while drawing'));

    expect(service.shape).not.toBeDefined();
  });

  it('should stop drawing on mouse up', () => {
    const event1: any = { layerX: 1, layerY: 2 };
    fakeDrawingService.isDrawing = false;
    service.startingPoint = { x: 10, y: 10 };
    service.onMouseDown(event1);

    const event: MouseEvent = new MouseEvent('mouseUp');
    spyOn(service.shape, 'setRenderer');
    service.onMouseUp(event);
    expect(service.shape.setRenderer).toHaveBeenCalled();
    expect(fakeDrawingService.isDrawing).toBeFalsy();
  });

  it('should create paint object on mouse down if is not drawing', () => {
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

  it('should not add points if is not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOn(service, 'generateRandomPoints');
    fakeDrawingService.isDrawing = false;
    service.onMouseMove(event);
    expect(service.generateRandomPoints).not.toHaveBeenCalled();
  });

  it('should add points if is drawing', () => {
    const event1: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event1, 'layerX').and.returnValue(1);
    spyOnProperty(event1, 'layerY').and.returnValue(1);
    service.startingPoint = { x: 10, y: 10 };
    fakeDrawingService.isDrawing = false;
    spyOn(service, 'generateRandomPoints');
    service.onMouseDown(event1);
    expect(fakeDrawingService.isDrawing).toBeTruthy();
    const event2: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event2, 'layerX').and.returnValue(5);
    spyOnProperty(event2, 'layerY').and.returnValue(129);
    service.onMouseMove(event2);
    expect(service.generateRandomPoints).toHaveBeenCalled();
  });

  it('should generate random points', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(0);
    spyOnProperty(event, 'layerY').and.returnValue(0);
    service.startingPoint = { x: 10, y: 10 };
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });
    service.shape = new SpraypaintObject(
      fakeShapeDepedency,
      service.renderer.createElement('g', 'svg'),
      PRIMARYCOLOR,
      { x: event.layerX, y: event.layerY },
      FAKE_ATTRIBUTS.width,
    );
    service.shape.linePoints = [];
    service.generateRandomPoints();
    expect(service.shape.linePoints.length).toBe(10);
  });
});

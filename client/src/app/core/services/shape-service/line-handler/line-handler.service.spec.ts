import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { LineObject } from 'src/app/core/models/shapes/line-object';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { LineHandlerService } from './line-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

const PRIMARYCOLOR: Color = new Color('#000000');

describe('LineHandlerService', () => {
  let fakeShapeDepedency: ShapeDependencyService;
  let service: LineHandlerService;
  let fakeDrawingService: DrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        LineHandlerService,
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
    service = TestBed.get(LineHandlerService);
  });
  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(LineHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Create the line on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    service.drawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.primaryColor = PRIMARYCOLOR;
    service.onMouseDown(event);
    expect(service.startingPoint).toEqual({ x: 5, y: 129 });
    expect(service.shape.pointsData).toEqual('M 5,129');
    expect(service.shape.colorData).toEqual(PRIMARYCOLOR.hex);
    expect(service.shape.color.a.toString).toEqual(PRIMARYCOLOR.a.toString);
    expect(service.shape.lineType).toEqual(FAKE_ATTRIBUTS.linePattern);
    expect(service.shape.lineJoint).toEqual(FAKE_ATTRIBUTS.lineJoint);
  });

  it('Update the line on mouseMouve while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;
    service.shape = new LineObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.linePattern,
      FAKE_ATTRIBUTS.junctionType,
      FAKE_ATTRIBUTS.pointJointDiameter,
    );
    service.shape.addPoint({ x: 20, y: 107 });
    service.onMouseMove(event);
    expect(service.shape.pointsData).toEqual('M 20,107 L 25,129');
    expect(service.shape.linePoints).toEqual([{ x: 20, y: 107 }, { x: 25, y: 129 }]);
  });

  it('Update the line on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    const spy = spyOn(service, 'setRenderer');
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;
    service.shape = new LineObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.linePattern,
      FAKE_ATTRIBUTS.junctionType,
      FAKE_ATTRIBUTS.pointJointDiameter,
    );
    service.shape.addPoint({ x: 20, y: 107 });
    service.onMouseUp(event);
    expect(spy).toHaveBeenCalled();
    expect(service.shape.pointsData).toEqual('M 20,107 L 22.5,118 C 25,129 25,129 25,129 L 25,129');
  });

  it('Do nothing on mouseMove while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    service.onMouseMove(event);
    expect(service.shape).not.toBeTruthy();
  });

  it('it should move shape and set the renderer on mouseDown drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOn(service, 'setRenderer');
    fakeDrawingService.isDrawing = true;
    service.shape = new LineObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.linePattern,
      FAKE_ATTRIBUTS.junctionType,
      FAKE_ATTRIBUTS.pointJointDiameter,
    );
    const spy1 = spyOn(service.shape, 'move');
    service.onMouseDown(event);
    expect(fakeDrawingService.isDrawing).toEqual(true);
    expect(spy1).toHaveBeenCalled();
    expect(service.setRenderer).toHaveBeenCalled();
  });

  it('Do nothing on mouseUp while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    fakeDrawingService.isDrawing = false;
    spyOn(service, 'endShape');
    service.onMouseUp(event);
    expect(service.shape).not.toBeTruthy();
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).not.toHaveBeenCalled();
  });

  it('change shift value on shift press', () => {
    service.shape = new LineObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.linePattern,
      FAKE_ATTRIBUTS.junctionType,
      FAKE_ATTRIBUTS.pointJointDiameter,
    );
    fakeDrawingService.isDrawing = true;
    service.shape.isClosed = false;
    service.onShiftDown(true);
    expect(service.isShiftDown).toBe(true);
    expect(service.shape.isClosed).toBe(true);
  });

  it('remove point on backspace while drawing', () => {
    service.shape = new LineObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.linePattern,
      FAKE_ATTRIBUTS.junctionType,
      FAKE_ATTRIBUTS.pointJointDiameter,
    );
    const spy = spyOn(service.shape, 'removePoint');
    service.onBackspace();
    expect(spy).toHaveBeenCalled();
  });

  it('End the line on doubleCLick while drawing', () => {
    const event: MouseEvent = new MouseEvent('dblclick');
    service.startingPoint = { x: 20, y: 107 };
    const spy = spyOn(service, 'setRenderer');
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });
    service.shape = new LineObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.linePattern,
      FAKE_ATTRIBUTS.junctionType,
      FAKE_ATTRIBUTS.pointJointDiameter,
    );
    service.shape.addPoint({ x: 25, y: 100 });
    service.shape.addPoint({ x: 25, y: 100 });
    service.shape.addPoint({ x: 25, y: 100 });
    spyOn(service, 'endShape');
    spyOn(service.shape, 'end').and.callThrough();
    service.onDoubleClick(event);
    expect(spy).toHaveBeenCalled();
    expect(service.shape.pointsData).toEqual('M 0,7 L 5,0');
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 20, 100)');
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });
    expect(service.shape.end).toHaveBeenCalled();
    expect(service.endShape).toHaveBeenCalled();
  });

  it('Do nothing on doubleClik while not drawing', () => {
    const event: MouseEvent = new MouseEvent('dblclick');

    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });

    spyOn(service, 'endShape');
    service.onDoubleClick(event);
    expect(service.shape).not.toBeTruthy();
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).not.toHaveBeenCalled();
  });
});

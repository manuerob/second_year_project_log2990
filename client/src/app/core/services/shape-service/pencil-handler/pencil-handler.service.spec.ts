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
import { PencilObject } from 'src/app/core/models/shapes/pencil-object';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { PencilHandlerService } from './pencil-handler.service';

const PRIMARYCOLOR: Color = new Color('#000000');

describe('PencilHandlerService', () => {
  let fakeShapeDepedency: ShapeDependencyService;
  let service: PencilHandlerService;
  let fakeDrawingService: DrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        { provide: RendererFactory2, useClass: MockRendererFactory },
        PencilHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
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
    service = TestBed.get(PencilHandlerService);
    service.canvasRef = { nativeElement: 'any' };
  });
  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(PencilHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('Create the pencil on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.primaryColor = PRIMARYCOLOR;
    service.onMouseDown(event);
    expect(service.startingPoint).toEqual({ x: 5, y: 129 });
    expect(service.shape.pointsData).toEqual('5,129 5,129 ');
    expect(service.shape.colorData).toEqual(PRIMARYCOLOR.hex);
    expect(service.shape.color.a.toString).toEqual(PRIMARYCOLOR.a.toString);
  });
  it('Trow error on mouseDown while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    fakeDrawingService.isDrawing = true;

    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected click while drawing'));
  });

  it('Update the pencil on mouseMouve while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;

    service.shape = new PencilObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      { x: 20, y: 107 },
      FAKE_ATTRIBUTS.width,
    );
    service.onMouseMove(event);
    expect(service.shape.pointsData).toEqual('20,107 20,107 25,129 ');
  });
  it('Do nothing on mouseMouve while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;

    service.onMouseMove(event);
    expect(service.shape).not.toBeTruthy();
  });

  it('End the pencil on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;

    service.shape = new PencilObject(
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
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.shape.end).toHaveBeenCalled();
    expect(service.endShape).toHaveBeenCalled();
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
});

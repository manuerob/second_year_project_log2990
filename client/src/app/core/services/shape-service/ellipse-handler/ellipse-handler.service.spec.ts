import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { EllipseObject } from 'src/app/core/models/shapes/ellipse-object';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { EllipseHandlerService } from './ellipse-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

const PRIMARYCOLOR: Color = new Color('#000000');
const SECONDARYCOLOR: Color = new Color('#999999');

describe('EllipseHandlerService', () => {
  let fakeShapeDepedency: ShapeDependencyService;
  let service: EllipseHandlerService;
  let fakeDrawingService: DrawingService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        EllipseHandlerService,
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
        { provide: RendererFactory2, useClass: MockRendererFactory },
      ],
    }),
  );
  beforeEach(() => {
    service = TestBed.get(EllipseHandlerService);
    service.canvasRef = { nativeElement: 'any' };
  });

  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(EllipseHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Create the ellipse on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);

    fakeDrawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.attributs.plotType = 'Full';
    service.primaryColor = PRIMARYCOLOR;
    service.secondaryColor = SECONDARYCOLOR;
    service.onMouseDown(event);

    expect(service.shape.size).toEqual({
      x: 0,
      y: 0,
    });
    expect(service.startingPoint).toEqual({ x: 5, y: 129 });
    expect(service.shape.colorData).toEqual(PRIMARYCOLOR.hex);
    expect(service.shape.color.a.toString).toEqual(PRIMARYCOLOR.a.toString);
    expect(service.shape.outColorData).toEqual(SECONDARYCOLOR.hex);
    expect(service.shape.outColor.a.toString).toEqual(SECONDARYCOLOR.a.toString);
  });
  it('Create an ellipse Outline on mouseDown while outline is slected and  not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    fakeDrawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.attributs.plotType = 'Outline';
    service.primaryColor = PRIMARYCOLOR;
    service.secondaryColor = SECONDARYCOLOR;
    service.onMouseDown(event);

    expect(service.shape.size).toEqual({
      x: 0,
      y: 0,
    });
    expect(service.startingPoint).toEqual({ x: 5, y: 129 });
    expect(service.shape.colorData).toEqual('none');
    expect(service.shape.outColorData).toEqual(SECONDARYCOLOR.hex);
    expect(service.shape.outColor.a.toString).toEqual(SECONDARYCOLOR.a.toString);
  });
  it('Create an ellipse without outline on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    fakeDrawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.attributs.plotType = 'FullWithoutOutline';
    service.primaryColor = PRIMARYCOLOR;
    service.secondaryColor = SECONDARYCOLOR;
    service.onMouseDown(event);

    expect(service.shape.size).toEqual({
      x: 0,
      y: 0,
    });
    expect(service.startingPoint).toEqual({ x: 5, y: 129 });
    expect(service.shape.colorData).toEqual(PRIMARYCOLOR.hex);
    expect(service.shape.color.a.toString).toEqual(PRIMARYCOLOR.a.toString);
    expect(service.shape.outColorData).toEqual('none');
  });

  it('Trow error on mouseDown while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    fakeDrawingService.isDrawing = true;
    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected drawing try while drawing'));
  });

  it('Update the ellipse on mouseMouve while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;
    service.shape = new EllipseObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 107 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    service.onMouseMove(event);
    expect(service.shape.size).toEqual({
      x: 5,
      y: 22,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 20, 107)');
  });
  it('Update the ellipse on mouseMouve while drawing when curent position is smaller than starting the point', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(29);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 109 };
    fakeDrawingService.isDrawing = true;
    service.shape = new EllipseObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 100 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    service.onMouseMove(event);
    expect(service.shape.size).toEqual({
      x: 15,
      y: 80,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 5, 29)');
  });
  it('Update the ellipse as a circle on mouseMouve while drawing and holding Shift', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 109 };

    fakeDrawingService.isDrawing = true;
    service.isShiftDown = true;
    service.shape = new EllipseObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 109 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    service.onMouseMove(event);
    expect(service.shape.size).toEqual({
      x: 20,
      y: 20,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 20, 109)');
  });
  it(`Update the ellipse as a circle on mouseMouve while drawing and holding Shift
  when curent position is smaller than starting the point`, () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(29);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 109 };

    fakeDrawingService.isDrawing = true;
    service.isShiftDown = true;
    service.shape = new EllipseObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 109 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    service.onMouseMove(event);
    expect(service.shape.size).toEqual({
      x: 80,
      y: 80,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, -60, 29)');
  });
  it('Do nothing on mouseMouve while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    service.onMouseMove(event);
    expect(service.shape).not.toBeTruthy();
  });

  it('End the ellipse on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.startingPoint = { x: 20, y: 107 };

    fakeDrawingService.isDrawing = true;
    service.shape = new EllipseObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 107 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    spyOn(service, 'endShape');
    service.onMouseUp(event);
    expect(service.shape.size).toEqual({
      x: 1,
      y: 5,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 20, 107)');
    expect(fakeDrawingService.isDrawing).toEqual(false);
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

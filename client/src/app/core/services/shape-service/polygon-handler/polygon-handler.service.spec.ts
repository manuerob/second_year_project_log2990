import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { PolygonObject } from 'src/app/core/models/shapes/polygon-object';
import { LEFT_CLICK } from '../../../../../../../common/constants/constants';
import { SaveDrawingService } from '../../../../components/save-drawing/service/save-drawing.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { PolygonHandlerService } from './polygon-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

const PRIMARYCOLOR: Color = new Color('#101000');
const SECONDARYCOLOR: Color = new Color('#999999');

describe('PolygonHandlerService', () => {
  let fakeShapeDepedency: ShapeDependencyService;
  let service: PolygonHandlerService;
  let fakeDrawingService: DrawingService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        PolygonHandlerService,
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
    service = TestBed.get(PolygonHandlerService);
    service.canvasRef = { nativeElement: 'any' };
  });

  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(PolygonHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Create the polygon on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
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
  it('Create a polygon Outline on mouseDown while outline is slected and  not drawing', () => {
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

  it('Create polygon without outline on mouseDown while not drawing', () => {
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

  it('Throw error on mouseDown while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    fakeDrawingService.isDrawing = true;

    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected click while drawing'));
  });

  it('Update the polygon on mouseMouve while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');

    spyOnProperty(event, 'layerX').and.returnValue(20);
    spyOnProperty(event, 'layerY').and.returnValue(-20);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 10, y: -10 };
    fakeDrawingService.isDrawing = true;

    service.shape = new PolygonObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 10, y: -10 },
      { x: 0, y: 0 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
      FAKE_ATTRIBUTS.sideCount,
    );
    service.onMouseMove(event);
    expect(service.shape.origin).toEqual({
      x: 10,
      y: -20,
    });
  });

  it('Update the polygon on mouseMouve while drawing when curent position is smaller than the starting point', () => {
    const event: MouseEvent = new MouseEvent('mousemove');

    spyOnProperty(event, 'layerX').and.returnValue(10);
    spyOnProperty(event, 'layerY').and.returnValue(-10);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: -20 };
    fakeDrawingService.isDrawing = true;

    service.shape = new PolygonObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: -20 },
      { x: 0, y: 0 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
      FAKE_ATTRIBUTS.sideCount,
    );
    service.onMouseMove(event);
    expect(service.shape.origin).toEqual({
      x: 10,
      y: -20,
    });
  });

  it('Do nothing on mouseMouve while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = true;
    // tslint:disable-next-line: no-unused-expression
    event.buttons !== LEFT_CLICK;
    const spy = spyOn(service, 'onMouseUp');
    service.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
    expect(service.shape).not.toBeTruthy();
  });

  it('Do nothing on mouseMouve while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    // tslint:disable-next-line: no-unused-expression
    event.buttons !== LEFT_CLICK;
    service.onMouseMove(event);
    expect(fakeDrawingService.isDrawing).toBe(false);
  });

  it('End the polygon on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;

    service.shape = new PolygonObject(
      fakeShapeDepedency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 107 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
      FAKE_ATTRIBUTS.sideCount,
    );
    spyOn(service, 'endShape');
    const spy = spyOn(service.renderer, 'removeChild');
    service.onMouseUp(event);
    expect(service.shape.size).toEqual({
      x: 1,
      y: 5,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, 20, 107)');
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
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

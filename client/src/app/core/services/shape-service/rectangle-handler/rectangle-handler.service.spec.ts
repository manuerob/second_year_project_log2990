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
import { RectangleObject } from 'src/app/core/models/shapes/rectangle-object';
import { LEFT_CLICK } from '../../../../../../../common/constants/constants';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { RectangleHandlerService } from './rectangle-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

const PRIMARYCOLOR: Color = new Color('#101000');
const SECONDARYCOLOR: Color = new Color('#999999');

describe('RectangleHandlerService', () => {
  let fakeShapeDependency: ShapeDependencyService;
  let service: RectangleHandlerService;
  let fakeDrawingService: DrawingService;
  let fakeRenderer: Renderer2;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        RectangleHandlerService,
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
    service = TestBed.get(RectangleHandlerService);
    fakeRenderer = TestBed.get(Renderer2);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDependency = TestBed.get(ShapeDependencyService);
    spyOn(fakeRenderer, 'listen');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('Create the rectangle on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });
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
  it('Create a rectangle Outline on mouseDown while outline is slected and  not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });
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
  it('Create rectangle without outline on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });
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

  it('Update the rectangle on mouseMouve while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;
    service.shape = new RectangleObject(
      fakeShapeDependency,
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
  it('Update the rectangle on mouseMouve while drawing when curent position is smaller than starting the point', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(29);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 109 };
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });
    service.shape = new RectangleObject(
      fakeShapeDependency,
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

  it('Update the rectangle as a square on mouseMouve while drawing and holding Shift', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(25);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 109 };
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });
    service.isShiftDown = true;
    service.shape = new RectangleObject(
      fakeShapeDependency,
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
  it(`Update the rectangle as a square on mouseMouve while drawing and holding Shift
  when curent position is smaller than starting the point`, () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(29);
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.startingPoint = { x: 20, y: 109 };
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: true });
    service.isShiftDown = true;
    service.shape = new RectangleObject(
      fakeShapeDependency,
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
      x: 80,
      y: 80,
    });
    expect(service.shape.transform).toEqual('matrix(1, 0, 0, 1, -60, 29)');
  });
  it('Do nothing on mouseMouve while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mousemove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });
    service.onMouseMove(event);
    expect(service.shape).not.toBeTruthy();
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

  it('End the reactangle on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.startingPoint = { x: 20, y: 107 };
    fakeDrawingService.isDrawing = true;
    service.shape = new RectangleObject(
      fakeShapeDependency,
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
    Object.defineProperty(fakeDrawingService, 'isDrawing', { value: false });
    spyOn(service, 'endShape');
    service.onMouseUp(event);
    expect(service.shape).not.toBeTruthy();
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).not.toHaveBeenCalled();
  });
});

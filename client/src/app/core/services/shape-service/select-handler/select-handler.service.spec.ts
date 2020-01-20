import { HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { RectangleObject } from 'src/app/core/models/shapes/rectangle-object';
import { SelectObject } from 'src/app/core/models/shapes/select-object';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { SaveDrawingService } from '../../../../components/save-drawing/service/save-drawing.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { SelectHandlerService } from './select-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

const PRIMARYCOLOR = new Color('#101000');
const SECONDARYCOLOR = new Color('#999999');

describe('SelectHandlerService', () => {
  let service: SelectHandlerService;
  let fakeShapeDependency: ShapeDependencyService;
  let fakeDrawingService: DrawingService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        ShapeDependencyService,
        SelectHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
        HttpHandler,
        { provide: RendererFactory2, useClass: MockRendererFactory },
      ],
    }),
  );

  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    service = TestBed.get(SelectHandlerService);
    service.canvasRef = { nativeElement: 'any' };
    fakeShapeDependency = TestBed.get(ShapeDependencyService);
    service.shape = new SelectObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 20, y: 30 },
      { x: 15, y: 15 },
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should indicate right click', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    spyOnProperty(event, 'button').and.returnValue(2);
    service.onMouseDown(event);
    expect(service.rightClick).toBeTruthy();
  });
  it('should setRenderer the new position', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    fakeDrawingService.isDrawing = false;

    service.onMouseDown(event);
  });
  it('should remove square if already drawn', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOn(service, 'removeSquare');
    spyOnProperty(event, 'button').and.returnValue(1);
    service.shape.isDrawn = true;
    service.onMouseDown(event);
    expect(spy).toHaveBeenCalled();
  });
  it('should change isDrawing to true when clicked', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    fakeDrawingService.isDrawing = false;

    service.onMouseDown(event);
    expect(fakeDrawingService.isDrawing).toBeTruthy();
  });

  it('Throw error on mouseDown while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    fakeDrawingService.isDrawing = true;

    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected drawing try while drawing'));
  });
  it('Throw error on mouseDown while drawing', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    fakeDrawingService.isDrawing = true;

    expect(() => service.onMouseDown(event)).toThrow(Error('Unexpected drawing try while drawing'));
  });

  it('should indicate no collision', () => {
    const shape: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 20, y: 107 },
      { x: 1, y: 5 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    expect(service.shape.collid(shape)).toBeFalsy();
  });

  it('should indicate a collision', () => {
    const shape: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 15, y: 25 },
      { x: 10, y: 15 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    expect(service.shape.collid(shape)).toBeTruthy();
  });

  it('should indicate a collision on right click and build the rectangle', () => {
    const shape1: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 15, y: 25 },
      { x: 10, y: 15 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );

    const shape2: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 0, y: 0 },
      { x: 20, y: 20 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    let shapes: Map<any, ShapeAbs>;
    shapes = new Map([['p', shape1], ['p', shape2]]);
    const svgsService = TestBed.get(DisplayShapesService);
    spyOnProperty(svgsService, 'svgs').and.returnValue(shapes);
    service.rightClick = true;
    service.collision();
    expect(service.shape.shapes.length).toBe(1);
  });
  it('should indicate no collision and not build rectangle', () => {
    const shape1: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 15, y: 25 },
      { x: 10, y: 15 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );

    const shape2: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 0, y: 0 },
      { x: 20, y: 20 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    let shapes: Map<any, ShapeAbs>;
    shapes = new Map([['p', shape1], ['p', shape2]]);
    const svgsService = TestBed.get(DisplayShapesService);
    spyOnProperty(svgsService, 'svgs').and.returnValue(shapes);
    service.collision();
    expect(service.shape.shapes.length).toBe(0);
  });

  it('should return isDrawn to false after removing square', () => {
    service.removeSquare();
    expect(service.shape.isDrawn).toBeFalsy();
  });

  it('should remove square', () => {
    service.shape.isDrawn = true;
    const spy: jasmine.Spy<() => void> = spyOn(service, 'removeSquare');
    service.reset();
    expect(spy).toHaveBeenCalled();
    expect(fakeDrawingService.isDrawing).toBeFalsy();
  });

  it('should not verify collision', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    fakeDrawingService.isDrawing = false;

    const spy = spyOn(service, 'collision');
    service.onMouseUp(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should verify collision', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    fakeDrawingService.isDrawing = true;

    const spy = spyOn(service, 'collision');
    service.onMouseUp(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should create circles when collision object where found', () => {
    const shape1: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 15, y: 25 },
      { x: 10, y: 15 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );

    const shape2: ShapeAbs = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      PRIMARYCOLOR,
      SECONDARYCOLOR,
      { x: 0, y: 0 },
      { x: 20, y: 20 },
      FAKE_ATTRIBUTS.width,
      FAKE_ATTRIBUTS.plotType,
    );
    service.shape.shapes = [shape1, shape2];
    const event: MouseEvent = new MouseEvent('mouseup');
    fakeDrawingService.isDrawing = true;

    service.onMouseUp(event);
    expect(service.shape.circles.length).toBeGreaterThan(0);
  });
});

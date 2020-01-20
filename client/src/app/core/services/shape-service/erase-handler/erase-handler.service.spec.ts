import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { RectangleObject } from 'src/app/core/models/shapes/rectangle-object';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { ShapeComposite } from 'src/app/core/models/shapes/shape-composite';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { EraseHandlerService } from './erase-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

describe('EraseHandlerService', () => {
  let fakeShapeDependency: ShapeDependencyService;
  let service: EraseHandlerService;
  let fakeDrawingService: DrawingService;
  let fakeSvgsService: DisplayShapesService;
  let fakeAttributService: AttributsService;
  let fakeHotkeyService: HotkeyManagerService;
  let fakeSaveDrawingService: SaveDrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        EraseHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
      ],
    }),
  );

  beforeEach(() => {
    service = TestBed.get(EraseHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeSvgsService = TestBed.get(DisplayShapesService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    service.canvasRef = { nativeElement: 'any' };
    fakeAttributService = TestBed.get(AttributsService);
    fakeHotkeyService = TestBed.get(HotkeyManagerService);
    fakeSaveDrawingService = TestBed.get(SaveDrawingService);
    fakeShapeDependency = TestBed.get(ShapeDependencyService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should remove eraser shape from canvas on mouse leave', () => {
    service.shape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
    );
    expect(service.mouseOnCanvas).toBeFalsy();
  });

  it('should detect collision if left click on mousedown', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'buttons').and.returnValue(1);
    service.onMouseDown(event);
    expect(service.leftClick).toBeTruthy();
  });

  it('should not detect collision if rigth click', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'buttons').and.returnValue(2);
    service.onMouseDown(event);
    expect(service.leftClick).toBeFalsy();
  });

  it('should delete shape if collids with eraser on mouse move', () => {
    const testService = new EraseHandlerService(
      fakeShapeDependency,
      fakeAttributService,
      fakeSaveDrawingService,
      fakeHotkeyService,
    );

    testService.shape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
    );

    const testRectangle = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      new Color(),
      { x: 1, y: 1 },
      { x: 20, y: 5 },
      10,
      '',
    );

    const testMap = new Map<any, ShapeAbs>();
    testMap.set('', testRectangle);

    spyOnProperty(fakeSvgsService, 'svgs').and.returnValue(testMap);
    fakeDrawingService.isDrawing = true;
    spyOn(testRectangle, 'delete');
    testService.mouseOnCanvas = true;
    spyOn(testService, 'onEnter');
    const event: MouseEvent = new MouseEvent('mouseMove');

    spyOnProperty(event, 'buttons').and.returnValue(1);
    testService.onMouseMove(event);
    expect(testRectangle.delete).toHaveBeenCalled();
    expect(testService.shape.shapes.length).toEqual(1);
    expect(testService.onEnter).not.toHaveBeenCalled();
  });

  it('should not delete shape if does not collid with eraser on mouse move', () => {
    const testService = new EraseHandlerService(
      fakeShapeDependency,
      fakeAttributService,
      fakeSaveDrawingService,
      fakeHotkeyService,
    );

    testService.shape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
    );

    const testRectangle = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      new Color(),
      { x: 30, y: 30 },
      { x: 20, y: 5 },
      10,
      '',
    );

    const testMap = new Map<any, ShapeAbs>();
    testMap.set('', testRectangle);

    spyOnProperty(fakeSvgsService, 'svgs').and.returnValue(testMap);
    fakeDrawingService.isDrawing = true;
    spyOn(testRectangle, 'delete');
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'buttons').and.returnValue(1);
    testService.onMouseMove(event);
    expect(testRectangle.delete).not.toHaveBeenCalled();
    expect(testService.shape.shapes.length).toEqual(0);
  });

  it('should not delete shape if rightClick on mouse move', () => {
    const testService = new EraseHandlerService(
      fakeShapeDependency,
      fakeAttributService,
      fakeSaveDrawingService,
      fakeHotkeyService,
    );

    testService.shape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
    );

    const testRectangle = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      new Color(),
      { x: 30, y: 30 },
      { x: 20, y: 5 },
      10,
      '',
    );

    const testMap = new Map<any, ShapeAbs>();
    testMap.set('', testRectangle);

    spyOnProperty(fakeSvgsService, 'svgs').and.returnValue(testMap);
    fakeDrawingService.isDrawing = true;
    spyOn(testRectangle, 'delete');
    spyOn(testService, 'onMouseUp');
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'buttons').and.returnValue(2);
    testService.onMouseMove(event);
    expect(testRectangle.delete).not.toHaveBeenCalled();
    expect(testService.onMouseUp).toHaveBeenCalled();
  });

  it('should update eraser shape on mouse move', () => {
    const testService = new EraseHandlerService(
      fakeShapeDependency,
      fakeAttributService,
      fakeSaveDrawingService,
      fakeHotkeyService,
    );

    testService.shape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
    );

    testService.mouseOnCanvas = false;
    spyOn(testService, 'setRenderer');
    spyOn(testService, 'onEnter');
    const event2: MouseEvent = new MouseEvent('mouseMove');
    testService.onMouseMove(event2);
    expect(testService.onEnter).toHaveBeenCalled();

    const expectedShape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 1, y: 1 },
      {
        x: 10,
        y: 10,
      },
    );

    fakeDrawingService.isDrawing = true;
    spyOn(testService, 'onMouseUp');
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'layerX').and.returnValue(6);
    spyOnProperty(event, 'layerY').and.returnValue(6);
    spyOnProperty(event, 'buttons').and.returnValue(1);

    testService.moveEraseRectangle(event);

    expect(testService.shape.origin).toEqual(expectedShape.origin);
  });

  it('should clear shape array on mouse up', () => {
    const testService = new EraseHandlerService(
      fakeShapeDependency,
      fakeAttributService,
      fakeSaveDrawingService,
      fakeHotkeyService,
    );

    testService.shape = new ShapeComposite(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 100, y: 100 },
      {
        x: 5,
        y: 5,
      },
    );

    const testRectangle = new RectangleObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      new Color(),
      { x: 0, y: 0 },
      { x: 200, y: 200 },
      200,
      '',
    );

    const testMap = new Map<any, ShapeAbs>();
    testMap.set('', testRectangle);

    spyOnProperty(fakeSvgsService, 'svgs').and.returnValue(testMap);

    const event1: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event1, 'layerX').and.returnValue(5);
    spyOnProperty(event1, 'layerY').and.returnValue(5);
    spyOnProperty(event1, 'buttons').and.returnValue(1);

    testRectangle.selected = true;

    testService.onMouseDown(event1);
    expect(testService.shape.shapes.length).toEqual(1);
    const event2: MouseEvent = new MouseEvent('mouseUp');
    testService.onMouseUp(event2);
    expect(testService.shape.shapes.length).toEqual(0);
    testService.onMouseUp(event2);
  });
});

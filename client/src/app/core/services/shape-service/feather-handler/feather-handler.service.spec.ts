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

import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { Color } from 'src/app/core/models/color';
import { FeatherObject } from 'src/app/core/models/shapes/feather-object';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { FeatherHandlerService } from './feather-handler.service';

describe('FeatherHandlerService', () => {
  let service: FeatherHandlerService;
  let fakeShapeDependency: ShapeDependencyService;
  let fakeDrawingService: DrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        FeatherHandlerService,
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
    service = TestBed.get(FeatherHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    service.canvasRef = { nativeElement: 'any' };
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
  });
  beforeEach(() => {
    fakeDrawingService = TestBed.get(DrawingService);
    service = TestBed.get(FeatherHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDependency = TestBed.get(ShapeDependencyService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should remove feather preview from canvas on mouse leave', () => {
    service.featherPreview = new ShapeAbs(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
      0,
    );
    service.onMouseLeave();
    expect(service.mouseOnCanvas).toBeFalsy();
  });

  it('should create feather preview shape on mouse move and mouse was not on canvas', () => {
    service.mouseOnCanvas = false;
    spyOn(service, 'onEnter').and.callThrough();
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    fakeDrawingService.isDrawing = true;
    const spy = spyOn(service, 'addFeatherPoint');
    const event: MouseEvent = new MouseEvent('mouseMove');
    service.onMouseMove(event);
    expect(service.onEnter).toHaveBeenCalled();
    expect(service.mouseOnCanvas).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should add feather point  on mouse move and mouse was not on canvas', () => {
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    fakeDrawingService.isDrawing = true;
    const event: MouseEvent = new MouseEvent('mouseMove');
    const spy = spyOn(service, 'addFeatherPoint');
    service.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
    expect(service.addFeatherPoint).toHaveBeenCalled();
  });

  it('should not feather preview shape on mouse move and mouse was on canvas', () => {
    service.mouseOnCanvas = true;
    spyOn(service, 'onEnter').and.callThrough();

    spyOn(service, 'updateFeatherPreview');
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    service.setRenderer(service.shape.htmlElement, [['opacity', '1']]);
    const event: MouseEvent = new MouseEvent('mouseMove');
    service.onMouseMove(event);
    expect(service.onEnter).not.toHaveBeenCalled();
    expect(service.mouseOnCanvas).toBeTruthy();
  });

  it('should end shape if is drawing on mouseup', () => {
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    spyOn(service, 'endShape');
    spyOn(service.shape, 'end');
    fakeDrawingService.isDrawing = true;
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.onMouseUp(event);
    expect(service.endShape).toHaveBeenCalled();
  });

  it('should not end shape if is not drawing on mouseup', () => {
    spyOn(service, 'endShape');
    fakeDrawingService.isDrawing = false;
    const event: MouseEvent = new MouseEvent('mouseUp');
    service.onMouseUp(event);
    expect(service.endShape).not.toHaveBeenCalled();
  });

  it('should not create shape if is drawing on mousedown', () => {
    spyOn(service, 'createFeatherShape');
    spyOn(service, 'setRenderer');
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    fakeDrawingService.isDrawing = true;
    const event: MouseEvent = new MouseEvent('mousedown');
    service.onMouseDown(event);
    expect(service.createFeatherShape).not.toHaveBeenCalled();
    expect(service.setRenderer).not.toHaveBeenCalled();
  });
  it('should create shape if is not drawing on mousedown', () => {
    spyOn(service, 'createFeatherShape');
    spyOn(service, 'setRenderer');
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    fakeDrawingService.isDrawing = false;
    const event: MouseEvent = new MouseEvent('mousedown');
    service.onMouseDown(event);
    expect(service.createFeatherShape).toHaveBeenCalled();
    expect(service.setRenderer).toHaveBeenCalled();
  });

  it('should change angle of 15 degrees on mouse wheel event without alt', () => {
    const event = new WheelEvent('wheel');
    service.featherPreview = new ShapeAbs(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
      0,
    );
    service.attributs.angle = 0;
    spyOnProperty(event, 'deltaY').and.returnValue(150);
    fakeDrawingService.isDrawing = true;

    spyOn(service, 'endShape');
    service.onMouseWheel(event);
    expect(service.attributs.angle).toEqual(15);
  });
  it('should change angle of 1 degree on mouse wheel event without alt', () => {
    const event = new WheelEvent('wheel');
    service.featherPreview = new ShapeAbs(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
      0,
    );
    spyOnProperty(event, 'deltaY').and.returnValue(150);
    spyOnProperty(event, 'altKey').and.returnValue(true);
    fakeDrawingService.isDrawing = true;

    service.attributs.angle = 0;
    spyOn(service, 'endShape');
    service.onMouseWheel(event);
    expect(service.attributs.angle).toEqual(1);
  });

  it('should delete feather shape on reset if is drawing', () => {
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    service.featherPreview = new ShapeAbs(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 0, y: 0 },
      {
        x: 10,
        y: 10,
      },
      0,
    );
    spyOn(service.shape, 'delete').and.callThrough();
    spyOn(service.renderer, 'removeChild');
    fakeDrawingService.isDrawing = true;
    service.mouseOnCanvas = true;
    service.reset();
    expect(fakeDrawingService.isDrawing).toBeFalsy();
    expect(service.shape.delete).toHaveBeenCalled();
    expect(service.renderer.removeChild).toHaveBeenCalled();
  });
  it('should not delete feather shape on reset if is not drawing', () => {
    service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
    spyOn(service.shape, 'delete').and.callThrough();
    fakeDrawingService.isDrawing = false;
    service.mouseOnCanvas = false;
    service.reset();
    expect(fakeDrawingService.isDrawing).toBeFalsy();
    expect(service.shape.delete).not.toHaveBeenCalled();
  });

  it('should add Feather points ', () => {
      service.shape = new FeatherObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      new Color(),
      { x: 0, y: 0 },
      10,
      0,
    );
      service.shape.linePoints = [
      { x: 1, y: 2 },
      { x: 4, y: 4 },
      { x: 8, y: 12},
    ];
      const event: MouseEvent = new MouseEvent('mouseMove');
      // tslint:disable-next-line: no-magic-numbers
      spyOnProperty(event, 'layerX').and.returnValue(5);
      // tslint:disable-next-line: no-magic-numbers
      spyOnProperty(event, 'layerY').and.returnValue(129);
      const spy = spyOn(service.shape, 'addToRenderer');
      const spy2 = spyOn(service.shape, 'addPoint');

      service.addFeatherPoint(event);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
  });

  it('should not do do anything if shape.linePoints.length <= 2 ', () => {
    service.shape = new FeatherObject(
    fakeShapeDependency,
    {} as SVGGraphicsElement,
    new Color(),
    { x: 0, y: 0 },
    10,
    0,
  );
    service.shape.linePoints = [
    { x: 1, y: 2 },
    { x: 4, y: 4 },
  ];
    const event: MouseEvent = new MouseEvent('mouseMove');
    // tslint:disable-next-line: no-magic-numbers
    spyOnProperty(event, 'layerX').and.returnValue(5);
    // tslint:disable-next-line: no-magic-numbers
    spyOnProperty(event, 'layerY').and.returnValue(129);
    const spy = spyOn(service.shape, 'addToRenderer');
    const spy2 = spyOn(service.shape, 'addPoint');

    service.addFeatherPoint(event);
    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
});

  it('should delete shape on reset  ', () => {
    service.shape = new FeatherObject(
    fakeShapeDependency,
    {} as SVGGraphicsElement,
    new Color(),
    { x: 0, y: 0 },
    10,
    0,
  );
    const event = new WheelEvent('wheel');
    service.featherPreview = new ShapeAbs(
    fakeShapeDependency,
    {} as SVGGraphicsElement,
    { x: 0, y: 0 },
    {
      x: 10,
      y: 10,
    },
    0,
  );
    service.attributs.angle = 0;
    fakeDrawingService.isDrawing = true;
    service.mouseOnCanvas = true;
    // tslint:disable-next-line: no-magic-numbers
    spyOnProperty(event, 'deltaY').and.returnValue(150);
    // tslint:disable-next-line: no-magic-numbers
    spyOnProperty(event, 'layerX').and.returnValue(5);
    // tslint:disable-next-line: no-magic-numbers
    spyOnProperty(event, 'layerY').and.returnValue(129);

    const spy = spyOn(service.shape, 'delete');
    const spy2 = spyOn(service.renderer, 'removeChild');

    service.reset ();
    expect(service.drawingService.isDrawing).toBe(false);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
});

  it('should create Feather shape  ', () => {
  const event = new WheelEvent('wheel');
  const spy = spyOn(service, 'setRenderer');
  service.createFeatherShape (event);
  expect(spy).toHaveBeenCalled();
});

});

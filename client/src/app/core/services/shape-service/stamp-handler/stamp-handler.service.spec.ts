import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { StampObject } from 'src/app/core/models/shapes/stamp-object';
import { ALT_SCROLL_JUMP, MAX_ANGLE } from '../../../../../../../common/constants/constants';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { StampHandlerService } from './stamp-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

describe('StampHandlerService', () => {
  let service: StampHandlerService;
  let fakeDrawingService: DrawingService;
  let fakeShapeDependency: ShapeDependencyService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        ShapeDependencyService,
        StampHandlerService,
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
    service = TestBed.get(StampHandlerService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fakeShapeDependency = TestBed.get(ShapeDependencyService);
  });

  beforeEach(() => {
    service = TestBed.get(StampHandlerService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    service.shape = new StampObject(
      fakeShapeDependency,
      {} as SVGGraphicsElement,
      { x: 20, y: 100 },
      FAKE_ATTRIBUTS.scaleFactor,
      FAKE_ATTRIBUTS.angle,
      FAKE_ATTRIBUTS.stampChoice,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set the stamp opacity to 1 on mouse down event', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    fakeDrawingService.isDrawing = true;
    spyOn(service, 'setRenderer');
    service.onMouseDown(event);
    expect(service.setRenderer).toHaveBeenCalledWith(service.shape.htmlElement, [['opacity', '1']]);
  });
  it('should set the stamp opacity a second time after a mouse up event', () => {
    const eventDown: MouseEvent = new MouseEvent('mouseDown');
    fakeDrawingService.isDrawing = true;

    spyOn(service, 'setRenderer');
    spyOn(service, 'endShape');
    service.onMouseDown(eventDown);
    expect(service.setRenderer).toHaveBeenCalledWith(service.shape.htmlElement, [['opacity', '1']]);
    const eventUp: MouseEvent = new MouseEvent('mouseUp');
    service.onMouseUp(eventUp);
    expect(fakeDrawingService.isDrawing).toBeFalsy();
    service.onMouseDown(eventDown);
    expect(service.setRenderer).toHaveBeenCalledTimes(2);
  });
  it('end the stamp on mouseUp while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    spyOn(service, 'endShape');
    fakeDrawingService.isDrawing = true;

    service.onMouseUp(event);
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).toHaveBeenCalled();
  });
  it('do nothing on mouseUp while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseUp');
    fakeDrawingService.isDrawing = false;

    spyOn(service, 'endShape');
    service.onMouseUp(event);
    expect(fakeDrawingService.isDrawing).toEqual(false);
    expect(service.endShape).not.toHaveBeenCalled();
  });
  it('should set the stamp image when stamp choice is defined', () => {
    const spy = spyOn(service, 'setRenderer');
    service.shape.stampChoice = 'any';
    service.setShapeAttributs();
    expect(spy.calls.allArgs()).toEqual([
      [
        service.shape.htmlElement,
        [
          ['x', '0'],
          ['y', '0'],
          ['width', service.shape.size.x.toString()],
          ['height', service.shape.size.y.toString()],
          ['transform', service.shape.transform],
          ['opacity', '.5'],
        ],
      ],
      [service.shape.htmlElement, [['href', service.shape.stampChoice]]],
    ]);
  });

  it('should change angle of 15 degrees on mouse wheel event without alt', () => {
    const event = new WheelEvent('wheel');
    spyOnProperty(event, 'deltaY').and.returnValue(100);
    fakeDrawingService.isDrawing = true;

    spyOn(service, 'endShape');
    spyOn(service, 'setShapeAttributs');
    service.onMouseWheel(event);
    expect(service.setShapeAttributs).toHaveBeenCalled();
    expect(service.attributs.angle).toEqual(15);
  });

  it('should change angle degree on mouse wheel event with a negative angle', () => {
    const event = new WheelEvent('wheel');
    spyOnProperty(event, 'deltaY').and.returnValue(-100);
    spyOnProperty(event, 'altKey').and.returnValue(true);
    fakeDrawingService.isDrawing = true;
    service.attributs.angle = -180;
    const deltaValue = Math.sign(event.deltaY);
    const temp = service.attributs.angle + MAX_ANGLE + deltaValue;
    spyOn(service, 'endShape');
    spyOn(service, 'setShapeAttributs');
    service.onMouseWheel(event);
    expect(service.setShapeAttributs).toHaveBeenCalled();
    expect(service.attributs.angle).toEqual(temp);
  });

  it('should change angle degree on mouse wheel event with a negative angle', () => {
    const event = new WheelEvent('wheel');
    spyOnProperty(event, 'deltaY').and.returnValue(-1);
    spyOnProperty(event, 'altKey').and.returnValue(false);
    fakeDrawingService.isDrawing = true;
    service.attributs.angle = 5;
    const deltaValue = Math.sign(event.deltaY) * ALT_SCROLL_JUMP;
    const temp = service.attributs.angle + MAX_ANGLE + deltaValue;
    spyOn(service, 'endShape');
    spyOn(service, 'setShapeAttributs');
    service.onMouseWheel(event);
    expect(service.setShapeAttributs).toHaveBeenCalled();
    expect(service.attributs.angle).toEqual(temp);
  });

  it('should change angle of 1 degree on mouse wheel event with alt', () => {
    const event = new WheelEvent('wheel');
    spyOnProperty(event, 'deltaY').and.returnValue(100);
    spyOnProperty(event, 'altKey').and.returnValue(true);
    fakeDrawingService.isDrawing = true;

    spyOn(service, 'endShape');
    spyOn(service, 'setShapeAttributs');
    service.onMouseWheel(event);
    expect(service.setShapeAttributs).toHaveBeenCalled();
    expect(service.attributs.angle).toEqual(1);
  });

  it('should create the stamp on mouseMove while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOn(service, 'setShapeAttributs');
    spyOn(service, 'setRenderer');
    fakeDrawingService.isDrawing = false;

    service.attributs = FAKE_ATTRIBUTS;
    service.onMouseMove(event);
    expect(service.shape.size).toEqual({
      x: 200,
      y: 200,
    });
    expect(service.shape.scaleFactor).toEqual(20);
    expect(service.startingPoint).toEqual({
      x: event.layerX,
      y: event.layerY,
    });
    expect(service.setRenderer).toHaveBeenCalledWith(service.shape.htmlElement, [
      ['opacity', '.5'],
    ]);
  });

  it('should update the stamp on mouseMove while drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseMove');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    spyOn(service, 'setShapeAttributs');
    spyOn(service, 'setRenderer');
    fakeDrawingService.isDrawing = true;

    service.attributs = FAKE_ATTRIBUTS;
    service.onMouseMove(event);
    expect(service.shape.size).toEqual({
      x: 200,
      y: 200,
    });
    expect(service.shape.scaleFactor).toEqual(20);
    expect(service.setShapeAttributs).toHaveBeenCalled();
  });

  it('should trow error on escpressed ', () => {
    expect(() => {
      service.onEscPressed();
    }).toThrow(new Error('Method not implemented.'));
  });

  it('should do nothing on ShiftDown ', () => {
    const isKeydown = false;
    const spy = spyOn(service, 'onShiftDown');
    service.onShiftDown(isKeydown);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

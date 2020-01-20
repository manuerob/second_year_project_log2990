import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MomentModule } from 'ngx-moment';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SelectObject } from 'src/app/core/models/shapes/select-object';
import { Point } from 'src/app/core/models/type';
import { ApiService } from '../../../api/api.service';
import { DrawingService } from '../../../drawing/drawing.service';
import { SnappingService } from './snapping.service';

// tslint:disable

describe('SnappingService', () => {
  let service: SnappingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, MomentModule],
      providers: [DrawingService, DisplayShapesService, ApiService],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(SnappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the left-top point of the shape when obtainPoint is called', () => {
    const shape = {} as SelectObject;
    service.snappingPoint = 'left-top';
    const temp = service.obtainPoint(shape);
    expect(temp).toBe(shape.origin);
  });

  it('should return the center-top point of the shape when obtainPoint is called', () => {
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = 'center-top';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({ x: shape.center.x, y: shape.origin.y });
  });
  it('should trow error when obtainPoint is called', () => {
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = '';
    expect(() => {
      service.obtainPoint(shape);
    }).toThrow(new Error('Unexpected snappingPoint'));
  });

  it('should return a the right-top point of the shape when obtainPoint is called', () => {
    const shape = {
      size: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = 'right-top';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({
      x: shape.origin.x + shape.size.x,
      y: shape.origin.y,
    });
  });

  it('should return a the left-middle point of the shape when obtainPoint is called', () => {
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = 'left-middle';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({ x: shape.origin.x, y: shape.center.y });
  });

  it('should return a the center-middle point of the shape when obtainPoint is called', () => {
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = 'center-middle';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual(shape.center);
  });

  it('should return a the right-middle point of the shape when obtainPoint is called', () => {
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
      size: { x: 9, y: 7 },
    } as SelectObject;
    service.snappingPoint = 'right-middle';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({
      x: shape.origin.x + shape.size.x,
      y: shape.center.y,
    });
  });

  it('should return a the left-bottom point of the shape when obtainPoint is called', () => {
    const shape = {
      size: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = 'left-bottom';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({
      x: shape.origin.x,
      y: shape.origin.y + shape.size.y,
    });
  });

  it('should return a the center-bottom point of the shape when obtainPoint is called', () => {
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
      size: { x: 9, y: 7 },
    } as SelectObject;
    service.snappingPoint = 'center-bottom';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({
      x: shape.center.x,
      y: shape.origin.y + shape.size.y,
    });
  });

  it('should return a the right-bottom point of the shape when obtainPoint is called', () => {
    const shape = {
      size: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
    } as SelectObject;
    service.snappingPoint = 'right-bottom';
    const temp = service.obtainPoint(shape);
    expect(temp).toEqual({
      x: shape.origin.x + shape.size.x,
      y: shape.origin.y + shape.size.y,
    });
  });

  it('should drag the selected shape when it exist on snapping', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
      size: { x: 9, y: 7 },
      moveShape: (obj: any) => {},
      updateRectangle: (obj: any) => {},
      renderRectangle: (obj: any) => {},
      updateCircle: (obj: any) => {},
    } as SelectObject;
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    service.deltaStart = { x: 3, y: 5 };
    service.showSnapping = true;
    service.snappingPoint = 'center-bottom';
    const spy = spyOn(shape, 'renderRectangle');
    const spy2 = spyOn(shape, 'moveShape');
    service.dragSelectedShapes(event, shape);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service.deltaStart.x).toEqual(10);
  });

  it('should drag the selected shape when snapping is off', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    const shape = {
      center: { x: 3, y: 5 },
      origin: { x: 4, y: 53 },
      size: { x: 9, y: 7 },
      moveShape: (obj: any) => {},
      updateRectangle: (obj: any) => {},
      renderRectangle: (obj: any) => {},
      updateCircle: (obj: any) => {},
    } as SelectObject;
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    service.deltaStart = { x: 3, y: 5 };
    service.toggleActiveSnapping(false);
    service.snappingPoint = 'center-bottom';
    const spy = spyOn(shape, 'updateCircle');
    const spy2 = spyOn(shape, 'moveShape');
    service.dragSelectedShapes(event, shape);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service.deltaStart.x).toEqual(5);
  });

  it('should do nothing if there is no shape  ', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    const shape = {} as SelectObject;
    const spy2 = spyOn(service, 'dragSelectedShapes');
    service.dragSelectedShapes(event, shape);
    expect(spy2).toHaveBeenCalled();
  });

  it('should return a point when processnap is called', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    const origin = { x: 0, y: 0 } as Point;
    const gridSize = 10;
    service.deltaStart = { x: 0, y: 0 };
    service.gridSize = gridSize;
    const delta: Point = {
      x: origin.x + event.layerX - service.deltaStart.x,
      y: origin.y + event.layerY - service.deltaStart.y,
    };
    const value = {
      x:
        delta.x -
        (((((delta.x + service.gridSize / 2) % service.gridSize) +
          service.gridSize) %
          service.gridSize) -
          service.gridSize / 2) -
        origin.x,
      y:
        delta.y -
        (((((delta.y + service.gridSize / 2) % service.gridSize) +
          service.gridSize) %
          service.gridSize) -
          service.gridSize / 2) -
        origin.y,
    };
    const temp = service.processSnap(event, origin);
    expect(temp).toEqual(value);
  });
});

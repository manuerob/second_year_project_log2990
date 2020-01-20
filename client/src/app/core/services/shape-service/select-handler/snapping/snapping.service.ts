import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridService } from 'src/app/components/canvas/grid/grid.service';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { SelectObject } from 'src/app/core/models/shapes/select-object';
import { Point } from 'src/app/core/models/type';
import { DEFAULT_SNAPPING_POINT } from '../../../../../../../../common/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class SnappingService extends AbstractSubscriptions {
  gridSize: number;
  deltaStart: Point;
  snappingPoint: string;
  activeSnapping: BehaviorSubject<boolean>;
  activeSnapping$: Observable<boolean>;

  constructor(private gridService: GridService) {
    super();
    this.subscriptions.push(
      this.gridService.sizeSmallSquare$.subscribe((size: number) => {
        this.gridSize = size;
      }),
    );

    this.activeSnapping = new BehaviorSubject<boolean>(false);

    this.activeSnapping$ = this.activeSnapping.asObservable();
    this.snappingPoint = DEFAULT_SNAPPING_POINT;
  }

  obtainPoint(shape: SelectObject): Point {
    switch (this.snappingPoint) {
      case 'left-top':
        return shape.origin;
      case 'center-top': {
        return { x: shape.center.x, y: shape.origin.y };
      }
      case 'right-top': {
        return { x: shape.origin.x + shape.size.x, y: shape.origin.y };
      }
      case 'left-middle': {
        return { x: shape.origin.x, y: shape.center.y };
      }
      case 'center-middle': {
        return shape.center;
      }
      case 'right-middle': {
        return { x: shape.origin.x + shape.size.x, y: shape.center.y };
      }
      case 'left-bottom': {
        return { x: shape.origin.x, y: shape.origin.y + shape.size.y };
      }
      case 'center-bottom': {
        return { x: shape.center.x, y: shape.origin.y + shape.size.y };
      }
      case 'right-bottom': {
        return {
          x: shape.origin.x + shape.size.x,
          y: shape.origin.y + shape.size.y,
        };
      }
      default:
        throw new Error('Unexpected snappingPoint');
    }
  }

  dragSelectedShapes(event: MouseEvent, shape: SelectObject): void {
    if (shape) {
      if (this.showSnapping) {
        shape.moveShape(this.processSnap(event, this.obtainPoint(shape)));
      } else {
        shape.moveShape({
          x: event.layerX - this.deltaStart.x,
          y: event.layerY - this.deltaStart.y,
        });
        this.deltaStart = { x: event.layerX, y: event.layerY };
      }
      shape.renderRectangle();
      shape.updateCircle();
    }
  }

  processSnap(event: MouseEvent, origin: Point): Point {
    let delta: Point = {
      x: origin.x + event.layerX - this.deltaStart.x,
      y: origin.y + event.layerY - this.deltaStart.y,
    };

    delta = {
      x:
        delta.x -
        (((((delta.x + this.gridSize / 2) % this.gridSize) + this.gridSize) %
          this.gridSize) -
          this.gridSize / 2) -
        origin.x,
      y:
        delta.y -
        (((((delta.y + this.gridSize / 2) % this.gridSize) + this.gridSize) %
          this.gridSize) -
          this.gridSize / 2) -
        origin.y,
    };

    if (delta.x) {
      this.deltaStart.x += delta.x;
    }
    if (delta.y) {
      this.deltaStart.y += delta.y;
    }
    return delta;
  }
  get showSnapping(): boolean {
    return this.activeSnapping.getValue();
  }
  set showSnapping(newShowGrid: boolean) {
    this.activeSnapping.next(newShowGrid);
  }
  toggleActiveSnapping(value: boolean): void {
    this.activeSnapping.next(value);
  }
}

import {
  APPLYCOLOR,
  ERASER,
  INTERSECTION,
} from '../../../../../../common/constants/constants';
import { ChangePrimaryColor } from '../../services/command-manager/commands/change-primary-color-command';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { Shape } from './shape';
import { ShapeAbs } from './shape-abs';
import { SimpleTracingLineStrategy } from './simple-shape';

// tslint:disable-next-line: no-any
declare var require: any;
// tslint:disable-next-line
const { ShapeInfo, Intersection } = require('kld-intersections');

export class TracingLineStrategy extends Shape {
  protected linePointsPrivate: Point[];
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
  ) {
    super(
      shapeDependency,
      htmlElement,
      color,
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      strokeWidth,
    );
    this.linePointsPrivate = [];
    this.linePointsPrivate.push(firstPoint);
    this.selected = false;
    // need to do twice to show a unique point
  }

  set linePoints(linePoints: Point[]) {
    this.linePointsPrivate = linePoints;
  }
  get linePoints(): Point[] {
    const linePoints: Point[] = [];
    for (const point of this.linePointsPrivate) {
      linePoints.push({ x: point.x * this.size.x, y: point.y * this.size.y });
    }
    return linePoints;
  }

  addPoint(newPoint: Point): void {
    this.linePointsPrivate.push(newPoint);
  }

  get pointsData(): string {
    let line: string = this.linePoints[0].x + ',' + this.linePoints[0].y + ' ';
    for (const point of this.linePoints) {
      line += point.x + ',' + point.y + ' ';
    }
    return line;
  }

  end(): void {
    this.origin = this.linePointsPrivate[0];
    let maxPoint: Point = this.linePointsPrivate[0];
    for (const point of this.linePointsPrivate) {
      this.origin = {
        x: Math.min(this.origin.x, point.x),
        y: Math.min(this.origin.y, point.y),
      };
      maxPoint = {
        x: Math.max(maxPoint.x, point.x),
        y: Math.max(maxPoint.y, point.y),
      };
    }
    this.size = {
      x: maxPoint.x - this.origin.x,
      y: maxPoint.y - this.origin.y,
    };
    const newLine: Point[] = [];
    for (let point of this.linePointsPrivate) {
      point = {
        x: this.size.x ? (point.x - this.origin.x) / this.size.x : 0,
        y: this.size.y ? (point.y - this.origin.y) / this.size.y : 0,
      };
      newLine.push(point);
    }
    this.linePointsPrivate = newLine;
    this.updateRender();
  }

  setListener(): void {
    this.renderer.listen(this.htmlElement, 'click', ($event: MouseEvent) => {
      $event.stopPropagation();
      $event.preventDefault();
      if (this.activeToolTitle === APPLYCOLOR) {
        const command: ChangePrimaryColor = new ChangePrimaryColor(
          this,
          this.primaryColor,
        );
        this.commandManager.addCommand(command);
        command.execute();
      }
      this.selected = true;
    });

    this.renderer.listen(
      this.htmlElement,
      'contextmenu',
      ($event: MouseEvent) => {
        $event.stopPropagation();
        $event.preventDefault();
      },
    );

    this.renderer.listen(
      this.htmlElement,
      'mouseenter',
      ($event: MouseEvent) => {
        $event.stopPropagation();
        $event.preventDefault();
        if (this.activeToolTitle === ERASER) {
          this.showRedSquare();
        }
      },
    );

    this.renderer.listen(
      this.htmlElement,
      'mouseleave',
      ($event: MouseEvent) => {
        $event.stopPropagation();
        $event.preventDefault();
        if (this.activeToolTitle === ERASER) {
          this.removeRedSquare();
        }
      },
    );

    this.renderer.listen(
      this.htmlElement,
      'mousedown',
      ($event: MouseEvent) => {
        if ($event.buttons === 1) {
          if (this.activeToolTitle === ERASER) {
            this.selected = true;
          }
        }
      },
    );
  }

  get shapeInfoLinePoint(): Point[] {
    const points: Point[] = [];
    for (const point of this.linePoints) {
      const newPoint = this.matrixMultiplication(this.transformMatrix, [
        [point.x],
        [point.y],
      ]);
      points.push({
        x: newPoint[0][0] + this.origin.x,
        y: newPoint[1][0] + this.origin.y,
      });
    }
    return points;
  }

  // tslint:disable-next-line: no-any
  get shapeInfo(): any {
    return ShapeInfo.polyline(this.shapeInfoLinePoint);
  }

  collid(shape: ShapeAbs): boolean {
    return (
      Intersection.intersect(this.shapeInfo, shape.shapeInfo).status ===
        INTERSECTION ||
      shape.internCollid({
        x: this.shapeInfoLinePoint[0].x,
        y: this.shapeInfoLinePoint[0].y,
      })
    );
  }
  get simplify(): SimpleTracingLineStrategy {
    return {
      shapeExportName: 'TracingLineStrategy',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      linePoints: this.linePointsPrivate,
      transformMatrix: this.transformMatrix,
    };
  }
}

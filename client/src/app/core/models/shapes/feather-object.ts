// tslint:disable-next-line: max-line-length
import { ONE_HUNDRED_EIGHTY_DEGREE } from '../../../../../../common/constants/constants';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { SimpleFeather } from './simple-shape';
import { TracingLineStrategy } from './tracing-line-strategy';
export class FeatherObject extends TracingLineStrategy {
  featherStrokes: SVGGraphicsElement[];
  angles: number[];
  strokeLength: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
    strokeLength: number,
  ) {
    super(shapeDependency, htmlElement, color, firstPoint, strokeWidth);
    this.linePoints = [
      { x: firstPoint.x, y: firstPoint.y },
      { x: firstPoint.x, y: firstPoint.y },
    ];
    this.featherStrokes = [];
    this.strokeLength = strokeLength;
    this.angles = [];
  }

  copyObject(): FeatherObject {
    const feather = new FeatherObject(
      this.shapeDependency,
      this.renderer.createElement('g', 'svg'),
      this.color,
      this.linePoints[0],
      this.strokeWidth,
      this.strokeLength,
    );
    feather.origin = this.origin;
    feather.size = this.size;
    feather.strokeLength = this.strokeLength;
    feather.strokeWidth = this.strokeWidth;
    feather.angles = this.angles;
    feather.linePoints = this.linePointsPrivate;
    feather.transformMatrix = this.transformMatrix;
    let i = 0;
    for (const angle of feather.angles) {
      if (i < this.linePoints.length - 2) {
        feather.featherStrokes.push(
          this.renderer.createElement('polyline', 'svg'),
        );
        feather.setRenderer(
          feather.featherStrokes[feather.featherStrokes.length - 1],
          [['points', feather.lineData(i + 2, angle, feather.strokeWidth)]],
        );
        feather.renderer.appendChild(
          feather.htmlElement,
          feather.featherStrokes[feather.featherStrokes.length - 1],
        );
        i++;
      }
    }

    return feather;
  }

  get pointsData(): string {
    let line: string = this.linePoints[0].x + ',' + this.linePoints[0].y + ' ';
    for (const point of this.linePoints) {
      line += point.x + ',' + point.y + ' ';
    }
    return line;
  }

  render(): void {
    this.updateRender();
    this.append();
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['fill', this.colorData],
      ['fill-opacity', this.color.a.toString()],
      ['stroke', this.colorData],
      ['stroke-opacity', this.color.a.toString()],
      ['stroke-width', this.strokeWidth.toString()],
      ['transform', this.transform],
    ]);

    let i = 0;
    for (const angle of this.angles) {
      if (i < this.linePoints.length - 2) {
        this.setRenderer(this.featherStrokes[i], [
          ['points', this.lineData(i + 2, angle, this.strokeWidth)],
          ['stroke-width', this.strokeWidth.toString()],
        ]);
        i++;
      }
    }
  }
  calculatePoints(i: number, angle: number, width: number): Point[] {
    const allPoints: Point[] = [];
    allPoints.push(this.linePoints[i - 2]);
    allPoints.push(this.linePoints[i - 1]);
    allPoints.push(this.linePoints[i]);
    for (let j = i; j >= i - 2; j--) {
      const xyComponent: Point = this.calculateXYComponents(
        this.linePoints[j],
        this.strokeLength,
        width,
        angle,
      );
      allPoints.push(xyComponent);
    }
    allPoints.push(this.linePoints[i - 2]);
    return allPoints;
  }

  getAllFeatherPoints(): Point[] {
    let points: Point[] = [];
    if (this.linePoints.length >= 2) {
      for (let i = 2; i < this.linePoints.length; i++) {
        points = points.concat(
          this.calculatePoints(i, this.angles[i - 2], this.strokeWidth),
        );
      }
    }
    return points;
  }

  get shapeInfoLinePoint(): Point[] {
    const points: Point[] = [];
    const allPoints: Point[] = this.getAllFeatherPoints();
    for (const point of allPoints) {
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
  lineData(i: number, angle: number, width: number): string {
    const allFeatherPoints = this.calculatePoints(i, angle, width);
    let value = '';
    let firstPoint = true;
    for (const point of allFeatherPoints) {
      if (firstPoint) {
        value += point.x + ',' + point.y;
        firstPoint = false;
      } else {
        value += ' ' + point.x + ',' + point.y;
      }
    }
    return value;
  }

  addToRenderer(angle: number, width: number): void {
    this.featherStrokes.push(this.renderer.createElement('polyline', 'svg'));
    this.angles.push(angle);
    this.setRenderer(this.featherStrokes[this.featherStrokes.length - 1], [
      ['points', this.lineData(this.linePoints.length - 1, angle, width)],
    ]);
    this.renderer.appendChild(
      this.htmlElement,
      this.featherStrokes[this.featherStrokes.length - 1],
    );
  }

  calculateXYComponents(
    point: Point,
    featherLength: number,
    width: number,
    degreeAngle: number,
  ): Point {
    const angle = -this.degree2radian(degreeAngle);
    const displacement = this.matrixMultiplication(
      [
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)],
      ],
      [[featherLength - width], [0]],
    );
    const xyComponent: Point = {
      x: point.x + displacement[0][0],
      y: point.y + displacement[1][0],
    };

    return xyComponent;
  }

  degree2radian(degree: number): number {
    return degree * (Math.PI / ONE_HUNDRED_EIGHTY_DEGREE);
  }

  get simplify(): SimpleFeather {
    return {
      shapeExportName: 'FeatherObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      linePoints: this.linePointsPrivate,
      angles: this.angles,
      strokeLength: this.strokeLength,
      transformMatrix: this.transformMatrix,
    };
  }
  end(): void {
    const points = this.shapeInfoLinePoint;
    this.origin = points[0];
    let maxPoint: Point = points[0];
    for (const point of points) {
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
}

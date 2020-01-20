import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { Geometric } from './geometric';
import { SimplePolygon } from './simple-shape';

// tslint:disable-next-line: no-any
declare var require: any;
// tslint:disable-next-line:no-require-imports no-var-requires naming-convention typedef
const { ShapeInfo, IntersectionQuery, Point2D } = require('kld-intersections');

export class PolygonObject extends Geometric {
  linePoints: Point[];
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    outColor: Color,
    origin: Point,
    size: Point,
    strokeWidth: number,
    plotType: string,
    private sideCount: number,
    angle: number = 0,
  ) {
    super(
      shapeDependency,
      htmlElement,
      color,
      outColor,
      origin,
      size,
      strokeWidth,
      plotType,
      angle,
    );
    this.linePoints = [];
    this.initLinePoints();
  }

  initLinePoints(): void {
    const delta: number = (Math.PI * 2) / this.sideCount;
    let angle = 0;
    while (angle < Math.PI * 2) {
      this.linePoints.push({
        x: Math.sin(angle),
        y: -Math.cos(angle),
      });
      angle += delta;
    }
  }

  get pointsData(): string {
    let line = '';
    for (const point of this.linePoints) {
      line +=
        (point.x * this.size.x + this.size.x) / 2 +
        ',' +
        (point.y * this.size.y + this.size.y) / 2 +
        ' ';
    }
    return line;
  }

  copyObject(): PolygonObject {
    const polygon: PolygonObject = new PolygonObject(
      this.shapeDependency,
      this.renderer.createElement('polygon', 'svg'),
      this.color,
      this.outColor,
      this.origin,
      this.size,
      this.strokeWidth,
      this.plotType,
      this.sideCount,
      this.angle,
    );
    polygon.origin = this.origin;
    polygon.size = this.size;
    polygon.transformMatrix = this.transformMatrix;

    return polygon;
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
      ['stroke', this.outColorData],
      ['stroke-linecap', 'round'],
      ['stroke-linejoin', 'round'],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-opacity', this.outColor.a.toString()],
      ['points', this.pointsData],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
  }

  internCollid(point: Point): boolean {
    return IntersectionQuery.pointInPolygon(
      new Point2D(point.x, point.y),
      this.shapeInfo.args[0],
    );
  }

  // tslint:disable-next-line: no-any
  get shapeInfo(): any {
    return ShapeInfo.polygon(this.shapeInfoLinePoint);
  }

  get shapeInfoLinePoint(): Point[] {
    const points: Point[] = [];
    for (const point of this.linePoints) {
      const newPoint = this.matrixMultiplication(this.transformMatrix, [
        [(point.x * this.size.x + this.size.x) / 2],
        [(point.y * this.size.y + this.size.y) / 2],
      ]);
      points.push({
        x: newPoint[0][0] + this.origin.x,
        y: newPoint[1][0] + this.origin.y,
      });
    }
    return points;
  }
  get simplify(): SimplePolygon {
    return {
      shapeExportName: 'PolygonObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      outColor: this.outColor,
      plotType: this.plotType,
      linePoints: this.linePoints,
      sideCount: this.sideCount,
      transformMatrix: this.transformMatrix,
    };
  }
}

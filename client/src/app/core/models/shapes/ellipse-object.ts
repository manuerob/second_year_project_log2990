import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { ELLIPSE_COLISION_PRECISION } from './../../../../../../common/constants/constants';
import { Geometric } from './geometric';
import { ShapeAbs } from './shape-abs';
import { SimpleEllipse } from './simple-shape';

// tslint:disable-next-line: no-any
declare var require: any;
// tslint:disable-next-line:no-require-imports no-var-requires naming-convention typedef
const { ShapeInfo, IntersectionQuery, Point2D } = require('kld-intersections');

export class EllipseObject extends Geometric {
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    outColor: Color,
    origin: Point,
    size: Point,
    strokeWidth: number,
    plotType: string,
    angle = 0,
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
  }

  copyObject(): ShapeAbs {
    const ellipse = new EllipseObject(
      this.shapeDependency,
      this.renderer.createElement('rect', 'svg'),
      this.color,
      this.outColor,
      this.origin,
      this.size,
      this.strokeWidth,
      this.plotType,
      this.angle,
    );
    ellipse.transformMatrix = this.transformMatrix;
    return ellipse;
  }

  render(): void {
    this.updateRender();
    this.append();
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['width', this.size.x.toString()],
      ['height', this.size.y.toString()],
      ['rx', this.size.x.toString()],
      ['ry', this.size.y.toString()],
      ['fill', this.colorData],
      ['fill-opacity', this.color.a.toString()],
      ['stroke', this.outColorData],
      ['stroke-opacity', this.outColor.a.toString()],
      ['stroke-width', this.strokeWidth.toString()],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
  }

  // tslint:disable-next-line: no-any
  get shapeInfo(): any {
    return ShapeInfo.polygon(this.shapeInfoLinePoint);
  }

  internCollid(point: Point): boolean {
    return IntersectionQuery.pointInPolygon(
      new Point2D(point.x, point.y),
      this.shapeInfo.args[0],
    );
  }

  get shapeInfoLinePoint(): Point[] {
    const linePoints: Point[] = [];
    const increment = (2 * Math.PI) / ELLIPSE_COLISION_PRECISION;
    for (let alpha = 0; alpha < 2 * Math.PI; alpha += increment) {
      const point = this.matrixMultiplication(this.transformMatrix, [
        [(this.size.x / 2) * Math.cos(alpha) + this.size.x / 2],
        [(this.size.y / 2) * Math.sin(alpha) + this.size.y / 2],
      ]);
      linePoints.push({
        x: point[0][0] + this.origin.x,
        y: point[1][0] + this.origin.y,
      });
    }
    return linePoints;
  }

  get simplify(): SimpleEllipse {
    return {
      shapeExportName: 'EllipseObject',
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
      transformMatrix: this.transformMatrix,
    };
  }
}

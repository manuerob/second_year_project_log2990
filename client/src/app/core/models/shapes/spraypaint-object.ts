import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { SimpleSpray } from './simple-shape';
import { TracingLineStrategy } from './tracing-line-strategy';

export class SpraypaintObject extends TracingLineStrategy {
  paintScatters: SVGGraphicsElement[];
  linePointRadiuses: number[];
  timerId: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
  ) {
    super(shapeDependency, htmlElement, color, firstPoint, strokeWidth);
    this.paintScatters = [];
    this.linePoints = [];
    this.linePointRadiuses = [];
  }

  render(): SVGGraphicsElement {
    this.updateRender();
    this.append();
    return this.svgG;
  }
  copyObject(): SpraypaintObject {
    const spray: SpraypaintObject = new SpraypaintObject(
      this.shapeDependency,
      this.renderer.createElement('g', 'svg'),
      this.color,
      this.linePoints[0],
      this.strokeWidth,
    );
    spray.origin = this.origin;
    spray.size = this.size;
    spray.linePoints = this.linePointsPrivate;
    spray.linePointRadiuses = this.linePointRadiuses;
    spray.transformMatrix = this.transformMatrix;
    let pointCount = 0;
    spray.linePoints.forEach((point: Point) => {
      const paint = spray.renderer.createElement('circle', 'svg');
      spray.setRenderer(paint, [
        ['cx', point.x.toString()],
        ['cy', point.y.toString()],
        ['r', spray.linePointRadiuses[pointCount].toString()],
        ['stroke', 'none'],
      ]);
      pointCount++;
      spray.paintScatters.push(paint);
      spray.renderer.appendChild(spray.htmlElement, paint);
      spray.addToRenderer();
    });
    return spray;
  }
  changePrimaryColor(color: Color): Color {
    const oldColor: Color = this.color;
    this.color = color;
    this.setRenderer(this.htmlElement, [
      ['fill', this.colorData],
      ['fill-opacity', this.color.a.toString()],
    ]);
    return oldColor;
  }
  addToRenderer(): void {
    this.renderer.appendChild(
      this.htmlElement,
      this.paintScatters[this.paintScatters.length - 1],
    );
  }
  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['fill', this.colorData],
      ['fill-opacity', this.color.a.toString()],
      ['stroke', 'none'],
      ['transform', this.transform],
      ['x', '0'],
      ['y', '0'],
    ]);
  }
  get simplify(): SimpleSpray {
    return {
      shapeExportName: 'SpraypaintObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      linePoints: this.linePointsPrivate,
      linePointRadiuses: this.linePointRadiuses,
      transformMatrix: this.transformMatrix,
    };
  }
  end(): void {
    super.end();
    let i = 0;
    for (const html of this.paintScatters) {
      this.setRenderer(html, [
        ['cx', this.linePoints[i].x.toString()],
        ['cy', this.linePoints[i].y.toString()],
      ]);
      i++;
    }
    this.updateRender();
  }
}

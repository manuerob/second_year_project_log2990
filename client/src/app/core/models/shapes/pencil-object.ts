import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { SimplePencil } from './simple-shape';
import { TracingLineStrategy } from './tracing-line-strategy';

export class PencilObject extends TracingLineStrategy {
  linePointsPrivate: Point[];
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
  ) {
    super(shapeDependency, htmlElement, color, firstPoint, strokeWidth);
  }

  copyObject(): PencilObject {
    const pencil: PencilObject = new PencilObject(
      this.shapeDependency,
      this.renderer.createElement('polyline', 'svg'),
      this.color,
      this.linePoints[0],
      this.strokeWidth,
    );
    pencil.linePoints = this.linePointsPrivate;
    pencil.origin = this.origin;
    pencil.size = this.size;
    pencil.transformMatrix = this.transformMatrix;
    return pencil;
  }

  render(): void {
    this.updateRender();
    this.append();
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-linejoin', 'round'],
      ['stroke', this.colorData],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-opacity', this.color.a.toString()],
      ['points', this.pointsData],
      ['transform', this.transform],
    ]);
  }

  get simplify(): SimplePencil {
    return {
      shapeExportName: 'PencilObject',
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

import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { SimpleBrush } from './simple-shape';
import { TracingLineStrategy } from './tracing-line-strategy';

export class BrushObject extends TracingLineStrategy {
  textureName: string;

  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
    textureName: string,
  ) {
    super(shapeDependency, htmlElement, color, firstPoint, strokeWidth);
    this.textureName = textureName;
  }
  copyObject(): BrushObject {
    const brush: BrushObject = new BrushObject(
      this.shapeDependency,
      this.renderer.createElement('polyline', 'svg'),
      this.color,
      this.linePoints[0],
      this.strokeWidth,
      this.textureName,
    );
    brush.transformMatrix = this.transformMatrix;
    brush.linePoints = this.linePointsPrivate;
    brush.origin = this.origin;
    brush.size = this.size;
    return brush;
  }

  get textureString(): string {
    return 'url(#' + this.textureName + ')';
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
      ['filter', this.textureString],
      ['points', this.pointsData],
      ['transform', this.transform],
    ]);
  }

  get simplify(): SimpleBrush {
    return {
      shapeExportName: 'BrushObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      linePoints: this.linePointsPrivate,
      textureName: this.textureName,
      transformMatrix: this.transformMatrix,
    };
  }
}

import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { Geometric } from './geometric';
import { ShapeAbs } from './shape-abs';
import { SimpleRectangle } from './simple-shape';

export class RectangleObject extends Geometric {
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    outColor: Color,
    origin: Point,
    size: Point,
    strokeWidth: number,
    plotType: string,
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
  }

  copyObject(): ShapeAbs {
    const rectangle = new RectangleObject(
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
    rectangle.transformMatrix = this.transformMatrix;
    return rectangle;
  }
  get simplify(): SimpleRectangle {
    return {
      shapeExportName: 'RectangleObject',
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

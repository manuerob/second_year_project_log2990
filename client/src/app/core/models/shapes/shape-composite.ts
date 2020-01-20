import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { ShapeAbs } from './shape-abs';

export class ShapeComposite extends ShapeAbs {
  shapes: ShapeAbs[];
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    origin: Point,
    size: Point,
  ) {
    super(shapeDependency, htmlElement, origin, size);
    this.shapes = [];
  }
  changePrimaryColor(newColor: Color): Color {
    for (const shape of this.shapes) {
      shape.changePrimaryColor(newColor);
    }
    return new Color('#fff');
  }

  changeAngle(): void {
    // to be implemented
  }

  changeSecondaryColor(newColor: Color): Color {
    for (const shape of this.shapes) {
      shape.changeSecondaryColor(newColor);
    }
    return new Color('#fff');
  }

  delete(): void {
    for (const shape of this.shapes) {
      shape.delete();
      this.svgsService.deleteSvg(shape.htmlElement);
    }
  }

  render(): void {
    for (const shape of this.shapes) {
      shape.render();
    }
  }

  copyObject(): ShapeComposite {
    const tempShape: ShapeComposite = new ShapeComposite(
      this.shapeDependency,
      this.renderer.createElement('rect', 'svg'),
      this.origin,
      this.size,
    );
    for (const shape of this.shapes) {
      tempShape.shapes.push(shape.copyObject());
    }
    tempShape.transformMatrix = this.transformMatrix;
    return tempShape;
  }

  moveShape(delta: Point): Point {
    for (const shape of this.shapes) {
      shape.moveShape(delta);
    }
    super.moveShape(delta);
    return { x: 0, y: 0 };
  }

  setListener(): void {
    //
  }
}

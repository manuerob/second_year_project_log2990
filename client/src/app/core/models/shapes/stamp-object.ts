import { STAMPS } from '../../../components/attributs/controls/stamp-controls/stamps';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Point } from '../type';
import { ShapeAbs } from './shape-abs';
import { SimpleStamp } from './simple-shape';

const DEFAULT_SIZE = 10;
export class StampObject extends ShapeAbs {
  stampChoice: string;
  scaleFactor: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    origin: Point,
    scaleFactor: number,
    angle: number,
    stampChoice: number,
  ) {
    super(
      shapeDependency,
      htmlElement,
      origin,
      { x: DEFAULT_SIZE * scaleFactor, y: DEFAULT_SIZE * scaleFactor },
      angle,
    );
    if (stampChoice >= 0 && stampChoice < STAMPS.length) {
      this.stampChoice = STAMPS[stampChoice];
    }
    this.scaleFactor = scaleFactor;
  }

  changeStamp(stampChoice: number): string {
    const oldStampChoice: string = this.stampChoice;
    if (stampChoice >= 0 && stampChoice < STAMPS.length) {
      this.stampChoice = STAMPS[stampChoice];
    }
    return oldStampChoice;
  }

  copyObject(): StampObject {
    const stamp: StampObject = new StampObject(
      this.shapeDependency,
      this.renderer.createElement('image', 'svg'),
      this.origin,
      this.scaleFactor,
      this.angle,
      0,
    );
    stamp.size = this.size;
    stamp.stampChoice = this.stampChoice;
    stamp.transformMatrix = this.transformMatrix;

    return stamp;
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
      ['opacity', '1'],
      ['transform', this.transform],
    ]);
    if (this.stampChoice !== undefined) {
      this.setRenderer(this.htmlElement, [['href', this.stampChoice]]);
    }
  }

  get simplify(): SimpleStamp {
    return {
      shapeExportName: 'StampObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      stampChoice: this.stampChoice,
      scaleFactor: this.scaleFactor,
      transformMatrix: this.transformMatrix,
    };
  }
}

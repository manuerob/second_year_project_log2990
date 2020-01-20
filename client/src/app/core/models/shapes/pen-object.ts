import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { SimplePen } from './simple-shape';
import { TracingLineStrategy } from './tracing-line-strategy';

export class PenObject extends TracingLineStrategy {
  svgG: SVGGraphicsElement;
  penStrokes: SVGGraphicsElement[];
  strokeWidths: number[];
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
  ) {
    super(shapeDependency, htmlElement, color, firstPoint, strokeWidth);
    this.penStrokes = [];
    this.htmlElement = htmlElement;
    this.strokeWidths = [];
  }

  render(): SVGGraphicsElement {
    this.updateRender();
    this.append();
    return this.svgG;
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-linejoin', 'round'],
      ['stroke', this.colorData],
      ['stroke-opacity', this.color.a.toString()],
      ['transform', this.transform],
    ]);
  }

  copyObject(): PenObject {
    const pen = new PenObject(
      this.shapeDependency,
      this.renderer.createElement('g', 'svg'),
      this.color,
      this.linePoints[0],
      this.strokeWidth,
    );
    pen.linePoints = this.linePointsPrivate;
    pen.origin = this.origin;
    pen.size = this.size;
    pen.strokeWidths = this.strokeWidths;
    pen.transformMatrix = this.transformMatrix;
    let i = 1;
    for (const width of pen.strokeWidths) {
      pen.penStrokes.push(this.renderer.createElement('polyline', 'svg'));
      pen.setRenderer(pen.penStrokes[i - 1], [
        ['stroke-width', width.toString()],
        ['points', pen.lineData(i)],
      ]);
      pen.renderer.appendChild(
        pen.htmlElement,
        pen.penStrokes[pen.penStrokes.length - 1],
      );
      i++;
    }
    return pen;
  }
  addToRenderer(): void {
    this.penStrokes.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.penStrokes[this.penStrokes.length - 1], [
      [
        'stroke-width',
        this.strokeWidths[this.strokeWidths.length - 1].toString(),
      ],
      ['points', this.lineData(this.linePoints.length - 1)],
    ]);
    this.renderer.appendChild(
      this.htmlElement,
      this.penStrokes[this.penStrokes.length - 1],
    );
  }
  lineData(i: number): string {
    let value = '';
    value += this.linePoints[i].x + ',' + this.linePoints[i].y + ' ';
    value += this.linePoints[i - 1].x + ',' + this.linePoints[i - 1].y;
    return value;
  }
  get simplify(): SimplePen {
    return {
      shapeExportName: 'PenObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      linePoints: this.linePointsPrivate,
      strokeWidths: this.strokeWidths,
      transformMatrix: this.transformMatrix,
    };
  }
  end(): void {
    super.end();
    let i = 1;
    for (const width of this.strokeWidths) {
      this.setRenderer(this.penStrokes[i - 1], [
        ['stroke-width', width.toString()],
        ['points', this.lineData(i)],
      ]);
      i++;
    }
  }
}

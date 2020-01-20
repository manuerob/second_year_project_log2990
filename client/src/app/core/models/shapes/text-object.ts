import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { ShapeAbs } from './shape-abs';
import { SimpleText } from './simple-shape';

export class TextObject extends ShapeAbs {
  tspanValues: string[];
  tspans: SVGGraphicsElement[];
  currentSpanCount: number;
  padding: number;
  color: Color;
  mutator: string;
  font: string;
  fontSize: number;
  alignment: string;
  originPrivate: Point;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    origin: Point,
    size: Point,
    color: Color,
    mutator: string,
    font: string,
    fontSize: number,
    alignment: string,
  ) {
    super(shapeDependency, htmlElement, origin, size);
    this.tspanValues = [''];
    this.tspans = [];
    this.currentSpanCount = 0;
    this.padding = 2;
    this.color = color;
    this.mutator = mutator;
    this.font = font;
    this.fontSize = fontSize;
    this.alignment = alignment;
    this.origin = origin;
  }

  get origin(): Point {
    if (this.alignment === 'end') {
      return {
        x: this.originPrivate.x + this.size.x,
        y: this.originPrivate.y,
      };
    } else if (this.alignment === 'middle') {
      return {
        x: this.originPrivate.x + this.size.x / 2,
        y: this.originPrivate.y,
      };
    } else {
      return this.originPrivate;
    }
  }
  set origin(newOrigin: Point) {
    if (this.alignment === 'end') {
      this.originPrivate = {
        x: newOrigin.x - this.size.x,
        y: newOrigin.y,
      };
    } else if (this.alignment === 'middle') {
      this.originPrivate = {
        x: newOrigin.x - this.size.x / 2,
        y: newOrigin.y,
      };
    } else {
      this.originPrivate = newOrigin;
    }
  }
  render(): void {
    this.svgG = this.renderer.createElement('g', 'svg');
    this.updateRender();
    this.append();
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['fill', this.color.hex],
      ['fill-opacity', this.color.a.toString()],
      ['transform', this.transform],
    ]);
  }

  copyObject(): TextObject {
    const htmlElement: SVGGraphicsElement = this.renderer.createElement(
      'text',
      'svg',
    );
    const textObject: TextObject = new TextObject(
      this.shapeDependency,
      htmlElement,
      this.origin,
      this.size,
      this.color,
      this.mutator,
      this.font,
      this.fontSize,
      this.alignment,
    );
    textObject.tspanValues = this.tspanValues;
    textObject.currentSpanCount = this.currentSpanCount;
    textObject.padding = this.padding;
    textObject.transformMatrix = this.transformMatrix;
    for (const iterator of textObject.tspanValues) {
      const tspan: SVGGraphicsElement = this.renderer.createElement(
        'tspan',
        'svg',
      );

      this.renderer.appendChild(htmlElement, tspan);
      this.renderer.setProperty(tspan, 'innerHTML', iterator);
      this.setRenderer(tspan, [
        ['dy', textObject.fontSize.toString()],
        ['x', '0'],
        ['text-anchor', textObject.alignment],
      ]);
      textObject.tspans.push(tspan);
    }
    const classStyle = `
        font: ${textObject.mutator} ${textObject.fontSize}px ${textObject.font}; stroke-fill: #031;`;
    this.renderer.setAttribute(htmlElement, 'style', classStyle);

    return textObject;
  }

  get transform(): string {
    /* [a c |e]  [x]     [ax + cy +e]
        [b d |f]*[y] = [bx + dy +f]
        [0 0 |1] [1]            [1]        */
    return (
      'matrix(' +
      this.transformMatrix[0][0] +
      ',' +
      this.transformMatrix[1][0] +
      ',' +
      this.transformMatrix[0][1] +
      ',' +
      this.transformMatrix[1][1] +
      ',' +
      this.origin.x +
      ', ' +
      this.origin.y +
      ')'
    );
  }
  get shapeInfoLinePoint(): Point[] {
    const linePoints: Point[] = [];
    let point: number[][] = this.matrixMultiplication(this.transformMatrix, [
      [0],
      [0],
    ]);
    linePoints.push({
      x: this.originPrivate.x + point[0][0],
      y: this.originPrivate.y + point[1][0],
    });
    point = this.matrixMultiplication(this.transformMatrix, [
      [this.size.x],
      [0],
    ]);
    linePoints.push({
      x: this.originPrivate.x + point[0][0],
      y: this.originPrivate.y + point[1][0],
    });
    point = this.matrixMultiplication(this.transformMatrix, [
      [this.size.x],
      [this.size.y],
    ]);
    linePoints.push({
      x: this.originPrivate.x + point[0][0],
      y: this.originPrivate.y + point[1][0],
    });
    point = this.matrixMultiplication(this.transformMatrix, [
      [0],
      [this.size.y],
    ]);
    linePoints.push({
      x: this.originPrivate.x + point[0][0],
      y: this.originPrivate.y + point[1][0],
    });
    return linePoints;
  }
  get simplify(): SimpleText {
    return {
      shapeExportName: 'TextObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      tspanValues: this.tspanValues,
      tspans: this.tspans,
      currentSpanCount: this.currentSpanCount,
      padding: this.padding,
      color: this.color,
      mutator: this.mutator,
      font: this.font,
      fontSize: this.fontSize,
      alignment: this.alignment,
      transformMatrix: this.transformMatrix,
    };
  }
}

import { AJUST_POINT_COUNT } from '../../../../../../common/constants/constants';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { SimpleLine } from './simple-shape';
import { TracingLineStrategy } from './tracing-line-strategy';

export class LineObject extends TracingLineStrategy {
  lineType: string;
  lineJoint: string;
  isClosed: boolean;
  markerRef: SVGGraphicsElement;
  jointSize: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    firstPoint: Point,
    strokeWidth: number,
    lineType: string,
    lineJoint: string,
    jointSize: number,
  ) {
    super(shapeDependency, htmlElement, color, firstPoint, strokeWidth);
    this.lineType = lineType;
    this.lineJoint = lineJoint;
    this.jointSize = jointSize;
    this.isClosed = false;
  }
  move(newPoint: Point): void {
    this.linePointsPrivate.pop();
    this.linePointsPrivate.push(newPoint);
  }
  removePoint(): void {
    if (this.linePoints.length > 1) {
      const currentPoint: Point = this.linePointsPrivate.pop() as Point;
      this.linePointsPrivate.pop();
      this.linePointsPrivate.push(currentPoint);
    }
  }

  changePrimaryColor(primaryColor: Color): Color {
    const oldColor: Color = this.color;
    if (this.lineJoint === 'circle') {
      this.setRenderer(this.markerRef, [
        ['fill', primaryColor.hex],
        ['fill-opacity', primaryColor.a.toString()],
      ]);
    }
    super.changePrimaryColor(primaryColor);
    return oldColor;
  }

  end(): void {
    // remove the double created by the preview/doubleclick
    this.linePointsPrivate.pop();
    this.linePointsPrivate.pop();
    super.end();
  }

  get pointsData(): string {
    let value = 'M ';
    switch (this.lineJoint) {
      case 'round': {
        if (this.linePoints.length >= AJUST_POINT_COUNT) {
          if (!this.isClosed) {
            value += this.linePoints[0].x + ',' + this.linePoints[0].y + ' L ';
          }
          value +=
            (this.linePoints[0].x + this.linePoints[1].x) / 2 +
            ',' +
            (this.linePoints[0].y + this.linePoints[1].y) / 2 +
            ' ';
          let i = 1;
          while (i < this.linePoints.length - 1) {
            value +=
              'C ' +
              this.linePoints[i].x +
              ',' +
              this.linePoints[i].y +
              ' ' +
              this.linePoints[i].x +
              ',' +
              this.linePoints[i].y +
              ' ' +
              (this.linePoints[i].x + this.linePoints[i + 1].x) / 2 +
              ',' +
              (this.linePoints[i].y + this.linePoints[i + 1].y) / 2 +
              ' ';
            i++;
          }
          if (this.isClosed) {
            value +=
              'C ' +
              this.linePoints[i].x +
              ',' +
              this.linePoints[i].y +
              ' ' +
              this.linePoints[i].x +
              ',' +
              this.linePoints[i].y +
              ' ' +
              (this.linePoints[i].x + this.linePoints[0].x) / 2 +
              ',' +
              (this.linePoints[i].y + this.linePoints[0].y) / 2 +
              ' ';
            value +=
              'C ' +
              this.linePoints[0].x +
              ',' +
              this.linePoints[0].y +
              ' ' +
              this.linePoints[0].x +
              ',' +
              this.linePoints[0].y +
              ' ' +
              (this.linePoints[0].x + this.linePoints[1].x) / 2 +
              ',' +
              (this.linePoints[0].y + this.linePoints[1].y) / 2;
          } else {
            value += 'L ' + this.linePoints[i].x + ',' + this.linePoints[i].y;
          }
        } else {
          value += this.linePoints[0].x + ',' + this.linePoints[0].y;
          if (this.linePoints[1]) {
            value += ' L ' + this.linePoints[1].x + ',' + this.linePoints[1].y;
          }
        }
        break;
      }
      case 'circle': {
        value += this.linePoints[0].x + ',' + this.linePoints[0].y;
        let i = 1;
        while (i < this.linePoints.length) {
          value += ' L ' + this.linePoints[i].x + ',' + this.linePoints[i].y;
          i++;
        }
        if (this.isClosed) {
          value += ' L ' + this.linePoints[0].x + ',' + this.linePoints[0].y;
        }
        break;
      }
      case 'normal': {
        value += this.linePoints[0].x + ',' + this.linePoints[0].y;
        let i = 1;
        while (i < this.linePoints.length) {
          value += ' L ' + this.linePoints[i].x + ',' + this.linePoints[i].y;
          i++;
        }
        if (this.isClosed) {
          value += ' L ' + this.linePoints[0].x + ',' + this.linePoints[0].y;
        }
        break;
      }
    }
    return value;
  }

  get lineTypeData(): string {
    switch (this.lineType) {
      case 'continue': {
        return '1';
      }
      case 'dash_line': {
        const patern: string =
          2 * this.strokeWidth + ', ' + 2 * this.strokeWidth;
        return patern;
      }
      case 'dot_line': {
        const patern: string = '1, ' + 2 * this.strokeWidth;
        return patern;
      }
      default: {
        throw new Error('Unexpected lineType');
      }
    }
  }

  render(): void {
    if (this.lineJoint === 'circle') {
      const dot: SVGGraphicsElement = this.renderer.createElement(
        'marker',
        'svg',
      );

      this.setRenderer(dot, [
        ['id', 'dotPoint'],
        ['style', 'overflow:visible'],
        ['markerUnits', 'userSpaceOnUse'],
      ]);
      const circle: SVGGraphicsElement = this.renderer.createElement(
        'circle',
        'svg',
      );
      this.setRenderer(circle, [
        ['cx', '0'],
        ['cy', '0'],
        ['r', (this.jointSize / 2).toString()],
        ['fill', this.colorData],
        ['fill-opacity', this.color.a.toString()],
      ]);

      this.renderer.appendChild(this.svgG, dot);
      this.renderer.appendChild(dot, circle);
      this.markerRef = circle;
      this.setRenderer(this.htmlElement, [['marker-mid', 'url(#dotPoint)']]);
    }
    this.updateRender();
    this.append();
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-linejoin', 'round'],
      ['stroke-dasharray', this.lineTypeData],
      ['stroke', this.colorData],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-opacity', this.color.a.toString()],
      ['d', this.pointsData],
      ['transform', this.transform],
    ]);
  }

  copyObject(): LineObject {
    const line: LineObject = new LineObject(
      this.shapeDependency,
      this.renderer.createElement('path', 'svg'),
      this.color,
      this.linePoints[0],
      this.strokeWidth,
      this.lineType,
      this.lineJoint,
      this.jointSize,
    );
    line.linePoints = this.linePointsPrivate;
    line.origin = this.origin;
    line.size = this.size;
    line.isClosed = this.isClosed;
    line.transformMatrix = this.transformMatrix;

    return line;
  }

  get simplify(): SimpleLine {
    return {
      shapeExportName: 'LineObject',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      linePoints: this.linePointsPrivate,
      lineType: this.lineType,
      lineJoint: this.lineJoint,
      isClosed: this.isClosed,
      markerRef: this.markerRef,
      jointSize: this.jointSize,
      transformMatrix: this.transformMatrix,
    };
  }
}

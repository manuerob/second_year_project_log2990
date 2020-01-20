import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { Geometric } from './geometric';

import { FULL_WITHOUT_OUTLINE, OUTLINE_ONLY } from './../../../../../../common/constants/constants';
import { SimpleBucket } from './simple-shape';

export class BucketObject extends Geometric {
  borderPoints: Point[];
  innerPoints: Point[];
  innerElements: SVGGraphicsElement[];
  borderElements: SVGGraphicsElement[];
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    outColor: Color,
    origin: Point,
    size: Point,
    strokeWidth: number,
    plotType: string,
    borderPoints: Point[],
    innerPoints: Point[],
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
    );
    this.borderPoints = borderPoints;
    this.innerPoints = innerPoints;
    this.borderElements = [];
    this.innerElements = [];
  }

  copyObject(): BucketObject {
    const polygon: BucketObject = new BucketObject(
      this.shapeDependency,
      this.renderer.createElement('g', 'svg'),
      this.color,
      this.outColor,
      this.origin,
      this.size,
      this.strokeWidth,
      this.plotType,
      this.borderPoints,
      this.innerPoints,
    );
    polygon.transformMatrix = this.transformMatrix;

    return polygon;
  }

  render(): void {
    if (!(this.plotType === OUTLINE_ONLY)) {
      this.getInnerPointsInString();
    }
    if (!(this.plotType === FULL_WITHOUT_OUTLINE)) {
      this.renderPoints();
    }
    this.append();
    this.updateRender();
  }

  changePrimaryColor(color: Color): Color {
    const oldColor: Color = this.color;
    this.color = color;
    for (const polyline of this.innerElements) {
      this.setRenderer(polyline, [
        ['stroke', this.colorData],
        ['stroke-opacity', this.color.a.toString()],
      ]);
    }
    return oldColor;
  }

  changeSecondaryColor(color: Color): Color {
    const oldColor: Color = this.outColor;
    this.outColor = color;
    for (const polyline of this.borderElements) {
      this.setRenderer(polyline, [
        ['stroke', this.outColorData],
        ['stroke-opacity', this.outColor.a.toString()],
      ]);
    }
    return oldColor;
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [['transform', this.transform]]);
    for (const htmlElement of this.innerElements) {
      this.setRenderer(htmlElement, [
        ['stroke', this.colorData],
        ['stroke-opacity', this.color.a.toString()],
      ]);
    }
    for (const htmlElement of this.borderElements) {
      this.setRenderer(htmlElement, [
        ['stroke', this.outColorData],
        ['stroke-opacity', this.outColor.a.toString()],
        ['vector-effect', 'non-scaling-stroke'],
      ]);
    }
  }

  isTooFar(previousPoint: Point, point: Point, maxDistance: number): boolean {
    return Math.hypot(previousPoint.x - point.x, previousPoint.y - point.y) <= maxDistance;
  }

  getInnerPointsInString(): void {
    let pointsString = '';
    this.innerElements.push(this.renderer.createElement('polyline', 'svg'));
    let previousPoint = this.innerPoints[0];
    pointsString += `${previousPoint.x},${previousPoint.y} `;
    for (const point of this.innerPoints) {
      if (!this.isTooFar(previousPoint, point, 2)) {
        this.endInnerLine(pointsString);
        this.innerElements.push(this.renderer.createElement('polyline', 'svg'));
        pointsString = `${point.x},${point.y} `;
      }
      pointsString += `${point.x},${point.y} `;
      previousPoint = point;
    }
    this.endInnerLine(pointsString);
  }

  end(): void {
    for (const point of this.innerPoints) {
      point.x = point.x - this.origin.x;
      point.y = point.y - this.origin.y;
    }
    for (const point of this.borderPoints) {
      point.x = point.x - this.origin.x;
      point.y = point.y - this.origin.y;
    }
  }

  endInnerLine(pointsString: string): void {
    this.setRenderer(this.innerElements[this.innerElements.length - 1], [
      ['points', pointsString],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', '2'],
    ]);
    this.renderer.appendChild(this.htmlElement, this.innerElements[this.innerElements.length - 1]);
  }

  endOuterLine(pointsString: string): void {
    this.setRenderer(this.borderElements[this.borderElements.length - 1], [
      ['points', pointsString],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', this.strokeWidth.toString()],
    ]);
    this.renderer.appendChild(
      this.htmlElement,
      this.borderElements[this.borderElements.length - 1],
    );
  }

  renderPoints(): void {
    let pointsString = '';
    this.borderElements.push(this.renderer.createElement('polyline', 'svg'));
    let previousPoint = this.borderPoints[0];
    pointsString += `${previousPoint.x},${previousPoint.y} `;
    for (const point of this.borderPoints) {
      if (!this.isTooFar(previousPoint, point, this.strokeWidth)) {
        this.endOuterLine(pointsString);
        this.borderElements.push(this.renderer.createElement('polyline', 'svg'));
        pointsString = `${point.x},${point.y} `;
      }
      pointsString += `${point.x},${point.y} `;
      previousPoint = point;
    }
    this.endOuterLine(pointsString);
  }

  get simplify(): SimpleBucket {
    return {
      shapeExportName: 'BucketObject',
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
      innerPoints: this.innerPoints,
      borderPoints: this.borderPoints,
    };
  }
}

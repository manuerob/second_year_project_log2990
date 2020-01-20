import { ERASER } from '../../../../../../common/constants/constants';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { ShapeSubscription } from './shape-subscription';
import { SimpleShapeAbs } from './simple-shape';
// tslint:disable
declare var require: any;
const { ShapeInfo, Intersection, IntersectionQuery } = require('kld-intersections');
const INTERSECTION = 'Intersection';
// tslint:enable
export class ShapeAbs extends ShapeSubscription {
  svgG: SVGGraphicsElement;
  redSquareDrawn: boolean;
  id: number;
  redSquare: SVGGraphicsElement;
  listenerSet: boolean;
  selected: boolean;
  transformMatrix: number[][];
  constructor(
    shapeDependency: ShapeDependencyService,
    public htmlElement: SVGGraphicsElement,
    public origin: Point, // Position of the top left corner of the englobing rectrangle
    public size: Point, // Position of the bottom right of the rectangle relative to the top left
    public angle = 0,
  ) {
    super(shapeDependency);
    this.redSquareDrawn = false;
    this.listenerSet = false;
    this.svgG = this.renderer.createElement('g', 'svg');
    this.transformMatrix = [[1, 0], [0, 1]];
  }
  append(): void {
    if (!this.listenerSet) {
      this.setListener();
      this.listenerSet = true;
    }
    if (this.redSquareDrawn) {
      this.renderer.removeChild(this.svgG, this.redSquare);
      this.redSquareDrawn = false;
    }
    this.svgsService.addSvgElement(this.htmlElement, this);
    this.renderer.appendChild(this.svgG, this.htmlElement);
    this.renderer.appendChild(this.canvasRef.nativeElement, this.svgG);
  }
  // tslint:disable-next-line: no-any
  get shapeInfo(): any {
    return ShapeInfo.polygon(this.shapeInfoLinePoint);
  }
  get shapeInfoLinePoint(): Point[] {
    const linePoints: Point[] = [];
    let point: number[][] = this.matrixMultiplication(this.transformMatrix, [[0], [0]]);
    linePoints.push({
      x: this.origin.x + point[0][0],
      y: this.origin.y + point[1][0],
    });
    point = this.matrixMultiplication(this.transformMatrix, [[this.size.x], [0]]);
    linePoints.push({
      x: this.origin.x + point[0][0],
      y: this.origin.y + point[1][0],
    });
    point = this.matrixMultiplication(this.transformMatrix, [[this.size.x], [this.size.y]]);
    linePoints.push({
      x: this.origin.x + point[0][0],
      y: this.origin.y + point[1][0],
    });
    point = this.matrixMultiplication(this.transformMatrix, [[0], [this.size.y]]);
    linePoints.push({
      x: this.origin.x + point[0][0],
      y: this.origin.y + point[1][0],
    });
    return linePoints;
  }
  get center(): Point {
    const newPoint = this.matrixMultiplication(this.transformMatrix, [
      [this.size.x],
      [this.size.y],
    ]);
    return {
      x: this.origin.x + newPoint[0][0] / 2,
      y: this.origin.y + newPoint[1][0] / 2,
    };
  }
  get middleCentre(): Point {
    const newPoint = this.matrixMultiplication(this.transformMatrix, [[this.size.x], [0]]);
    return {
      x: this.origin.x + newPoint[0][0] / 2,
      y: this.origin.y + newPoint[1][0] / 2,
    };
  }
  internCollid(point: Point): boolean {
    return IntersectionQuery.pointInPolygon(point, this.shapeInfo.args[0]);
  }
  collid(shape: ShapeAbs): boolean {
    return (
      Intersection.intersect(this.shapeInfo, shape.shapeInfo).status === INTERSECTION ||
      this.internCollid(shape.middleCentre) ||
      shape.internCollid(this.middleCentre)
    );
  }
  get transform(): string {
    return (
      'matrix(' +
      this.transformMatrix[0][0] +
      ', ' +
      this.transformMatrix[1][0] +
      ', ' +
      this.transformMatrix[0][1] +
      ', ' +
      this.transformMatrix[1][1] +
      ', ' +
      this.origin.x +
      ', ' +
      this.origin.y +
      ')'
    );
  }
  copyObject(): ShapeAbs {
    const newShape = new ShapeAbs(
      this.shapeDependency,
      {} as SVGGraphicsElement,
      this.origin,
      this.size,
      this.angle,
    );
    newShape.transformMatrix = this.transformMatrix;
    return newShape;
  }
  moveShape(delta: Point): Point {
    const tempOrigin: Point = this.origin;
    this.origin = { x: this.origin.x + delta.x, y: this.origin.y + delta.y };
    this.updateRender();
    return tempOrigin;
  }
  delete(): void {
    this.svgsService.deleteSvg(this.htmlElement);
    if (this.redSquareDrawn) {
      this.renderer.removeChild(this.svgG, this.redSquare);
    }
    this.removeRender();
  }

  rotate(deltaAngle: number, isShifted: boolean = false, pivot?: Point): void {
    // tslint:disable-next-line: no-magic-numbers
    const angle = (deltaAngle / 180) * Math.PI; // convertion in radian
    const center = this.center;

    this.pureRotation(center, angle);

    if (pivot && !isShifted) {
      this.rotateAroundPivot(center, pivot, angle);
    }
    this.updateRender();
  }

  rotateAroundPivot(center: Point, pivot: Point, angle: number): void {
    let displacement: Point = {
      x: center.x - pivot.x,
      y: center.y - pivot.y,
    };
    displacement = {
      x: displacement.x * Math.cos(angle) - displacement.y * Math.sin(angle) - displacement.x,
      y: displacement.x * Math.sin(angle) + displacement.y * Math.cos(angle) - displacement.y,
    };
    this.moveShape(displacement);
  }

  // rotate the object arround his own center
  pureRotation(center: Point, angle: number): void {
    const rotationMatrix = [
      [Math.cos(angle), -Math.sin(angle)],
      [Math.sin(angle), Math.cos(angle)],
    ];

    const newOrigin = this.matrixMultiplication(rotationMatrix, [
      [this.origin.x - center.x],
      [this.origin.y - center.y],
    ]);
    this.origin = {
      x: newOrigin[0][0] + center.x,
      y: newOrigin[1][0] + center.y,
    };
    this.transformMatrix = this.matrixMultiplication(rotationMatrix, this.transformMatrix);
  }

  removeRender(): void {
    this.renderer.removeChild(this.canvasRef, this.svgG);
  }

  setRenderer(htmlElement: SVGGraphicsElement, setter: [string, string][]): void {
    setter.forEach(([key, value]: [string, string]) => {
      this.renderer.setAttribute(htmlElement, key, value);
    });
  }
  showRedSquare(): void {
    this.redSquare = this.renderer.createElement('rect', 'svg');
    this.setRenderer(this.redSquare, [
      ['x', '0'],
      ['y', '0'],
      ['width', this.size.x.toString()],
      ['height', this.size.y.toString()],
      ['fill', 'none'],
      ['stroke', 'red'],
      ['stroke-width', '5'],
      ['vector-effect', 'non-scaling-stroke'],
      ['transform', this.transform],
    ]);
    this.renderer.appendChild(this.svgG, this.redSquare);
    this.redSquareDrawn = true;
  }
  removeRedSquare(): void {
    this.renderer.removeChild(this.svgG, this.redSquare);
    this.redSquareDrawn = false;
  }
  setListener(): void {
    this.renderer.listen(this.htmlElement, 'mouseenter', ($event: MouseEvent) => {
      $event.stopPropagation();
      $event.preventDefault();
      if (this.activeToolTitle === ERASER) {
        this.showRedSquare();
      }
    });
    this.renderer.listen(this.htmlElement, 'mouseleave', ($event: MouseEvent) => {
      $event.stopPropagation();
      $event.preventDefault();
      if (this.activeToolTitle === ERASER) {
        this.removeRedSquare();
      }
    });
    this.renderer.listen(this.htmlElement, 'mousedown', ($event: MouseEvent) => {
      if ($event.buttons === 1) {
        if (this.activeToolTitle === ERASER) {
          this.selected = true;
        }
      }
    });
  }
  get simplify(): SimpleShapeAbs {
    return {
      shapeExportName: 'ShapeAbs',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      transformMatrix: this.transformMatrix,
    };
  }
  matrixMultiplication(matM: number[][], matN: number[][]): number[][] {
    const matO: number[][] = [];
    const side = Math.min(matM[0].length, matN.length);
    for (let i = 0; i < matM.length; i++) {
      matO[i] = [];
      for (let j = 0; j < matN[0].length; j++) {
        matO[i][j] = 0;
        for (let k = 0; k < side; k++) {
          matO[i][j] += matM[i][k] * matN[k][j];
        }
      }
    }
    return matO;
  }

  inverseSquareMatrix(matA: number[][]): number[][] {
    const a = matA[0][0];
    const b = matA[0][1];
    const c = matA[1][0];
    const d = matA[1][1];
    const detA = a * d - b * c;
    const matB: number[][] = [[d / detA, -b / detA], [-c / detA, a / detA]];
    return matB;
  }

  changePrimaryColor(color: Color): Color {
    return new Color('#fff');
  }

  changeSecondaryColor(color: Color): Color {
    return new Color('#fff');
  }

  render(): void {
    /*to override by children*/
  }
  updateRender(): void {
    /*to override by children*/
  }
}

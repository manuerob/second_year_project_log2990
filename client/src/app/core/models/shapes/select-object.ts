import { Injectable } from '@angular/core';
import {
  BACKGROUND_COLOR,
  CIRCLE_STROKE_WIDTH,
  ROTATE_WHEEL_TIME,
  SELECT,
} from '../../../../../../common/constants/constants';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Point } from '../type';
import { RotateCommand } from './../../services/command-manager/commands/rotate-command';
import { ShapeComposite } from './shape-composite';
/* tslint:disable:no-magic-numbers */
@Injectable({
  providedIn: 'root',
})
export class SelectObject extends ShapeComposite {
  circles: SVGGraphicsElement[];
  isDrawn: boolean;
  dragging: boolean;
  selectionSquareRef: SVGGraphicsElement;
  // tslint:disable-next-line: no-any
  timer: any;
  timerIsOn: boolean;
  deltaAngle: number;
  isShifted: boolean;

  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    origin: Point,
    size: Point,
  ) {
    super(shapeDependency, htmlElement, origin, size);
    this.circles = [];
    this.isDrawn = false;
    this.timerIsOn = false;
    this.isShifted = false;
    this.deltaAngle = 0;
  }

  updateRender(): void {
    this.renderRectangle();
    this.updateCircle();
  }

  renderRectangle(): void {
    this.setRenderer(this.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['width', this.size.x.toString()],
      ['height', this.size.y.toString()],
      ['fill', '#F7F7F2'],
      ['fill-opacity', '0.2'],
      ['stroke', '#4A4A4A'],
      ['stroke-width', '2'],
      ['stroke-opacity', '1'],
      ['stroke-dasharray', '10 10'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
  }

  createCircle(): void {
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[0], [
      ['points', '0,0 0,0'],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[0]);
    this.setCircleListener(this.circles[0], {x: 0, y: 0});
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[1], [
      ['points', '' + this.size.x + ',' + 0 + ' ' + this.size.x + ',' + 0],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[1]);
    this.setCircleListener(this.circles[1], { x: 1, y: 0 });
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[2], [
      ['points', '' + 0 + ',' + this.size.y + ' ' + 0 + ',' + this.size.y],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[2]);
    this.setCircleListener(this.circles[2], { x: 0, y: 1 });
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[3], [
      [
        'points',
        '' +
          this.size.x +
          ',' +
          this.size.y +
          ' ' +
          this.size.x +
          ',' +
          this.size.y,
      ],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    // tslint:disable-next-line: no-magic-numbers
    this.renderer.appendChild(this.svgG, this.circles[3]);
    this.setCircleListener(this.circles[3], { x: 1, y: 1 });
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[4], [
      [
        'points',
        '' + this.size.x / 2 + ',' + 0 + ' ' + this.size.x / 2 + ',' + 0,
      ],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[4]);
    this.setCircleListener(this.circles[4], { x: 0.5, y: 0 });
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[5], [
      [
        'points',
        '' + 0 + ',' + this.size.y / 2 + ' ' + 0 + ',' + this.size.y / 2,
      ],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[5]);
    this.setCircleListener(this.circles[5], { x: 0, y: 0.5 });
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[6], [
      [
        'points',
        '' +
          this.size.x / 2 +
          ',' +
          this.size.y +
          ' ' +
          this.size.x / 2 +
          ',' +
          this.size.y,
      ],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[6]);
    this.setCircleListener(this.circles[6], { x: 0.5, y: 1 });
    this.circles.push(this.renderer.createElement('polyline', 'svg'));
    this.setRenderer(this.circles[7], [
      [
        'points',
        '' +
          this.size.x +
          ',' +
          this.size.y / 2 +
          ' ' +
          this.size.x +
          ',' +
          this.size.y / 2,
      ],
      ['fill', 'none'],
      ['stroke-linecap', 'round'],
      ['stroke-width', CIRCLE_STROKE_WIDTH],
      ['stroke', '#000000'],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
    this.renderer.appendChild(this.svgG, this.circles[7]);
    this.setCircleListener(this.circles[7], { x: 1, y: 0.5 });
  }

  updateCircle(): void {
    this.setRenderer(this.circles[0], [
      ['points', '0,0 0,0'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[1], [
      ['points', '' + this.size.x + ',' + 0 + ' ' + this.size.x + ',' + 0],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[2], [
      ['points', '' + 0 + ',' + this.size.y + ' ' + 0 + ',' + this.size.y],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[3], [
      [
        'points',
        '' +
          this.size.x +
          ',' +
          this.size.y +
          ' ' +
          this.size.x +
          ',' +
          this.size.y,
      ],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[4], [
      [
        'points',
        '' + this.size.x / 2 + ',' + 0 + ' ' + this.size.x / 2 + ',' + 0,
      ],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[5], [
      [
        'points',
        '' + 0 + ',' + this.size.y / 2 + ' ' + 0 + ',' + this.size.y / 2,
      ],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[6], [
      [
        'points',
        '' +
          this.size.x / 2 +
          ',' +
          this.size.y +
          ' ' +
          this.size.x / 2 +
          ',' +
          this.size.y,
      ],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
    this.setRenderer(this.circles[7], [
      [
        'points',
        '' +
          this.size.x +
          ',' +
          this.size.y / 2 +
          ' ' +
          this.size.x +
          ',' +
          this.size.y / 2,
      ],
      ['stroke', '#000'],
      ['transform', this.transform],
    ]);
  }

  setCircleListener(circle: SVGGraphicsElement, corner: Point): void {
    this.renderer.listen(circle, 'mousedown', ($event: MouseEvent) => {
      $event.stopPropagation();
      this.shapeDependency.resizeService.startResize($event, corner, this);
    });
    this.renderer.listen(circle, 'mouseover', ($event: MouseEvent) => {
      $event.stopPropagation();
      if ($event.target && !this.shapeDependency.resizeService.isActive) {
        this.setRenderer($event.target as SVGGraphicsElement, [
          ['stroke', BACKGROUND_COLOR],
        ]);
      }
    });
    this.renderer.listen(circle, 'mouseleave', ($event: MouseEvent) => {
      $event.stopPropagation();
      if ($event.target && !this.shapeDependency.resizeService.isActive) {
        this.setRenderer($event.target as SVGGraphicsElement, [
          ['stroke', '#000'],
        ]);
      }
    });
  }

  removeCircles(): void {
    this.circles.forEach((circle: SVGGraphicsElement) => {
      this.renderer.removeChild(this.svgG, circle);
    });
  }

  setListener(): void {
    this.renderer.listen(
      this.htmlElement,
      'mousedown',
      ($event: MouseEvent) => {
        if ($event.buttons === 1) {
          if (this.activeToolTitle === SELECT) {
            this.dragging = true;
          }
        }
      },
    );
  }
  updateRectangle(): void {
    let minPoint: Point = this.shapes[0].shapeInfoLinePoint[0];
    let maxPoint: Point = this.shapes[0].shapeInfoLinePoint[0];
    for (const shape of this.shapes) {
      for (const point of shape.shapeInfoLinePoint) {
        minPoint = {
          x: Math.min(minPoint.x, point.x),
          y: Math.min(minPoint.y, point.y),
        };
        maxPoint = {
          x: Math.max(maxPoint.x, point.x),
          y: Math.max(maxPoint.y, point.y),
        };
      }
    }
    this.origin = minPoint;
    this.size.x = (maxPoint.x - minPoint.x) ? maxPoint.x - minPoint.x : 1;
    this.size.y = (maxPoint.y - minPoint.y) ? maxPoint.y - minPoint.y : 1;

    this.renderRectangle();

    this.isDrawn = true;
  }

  registerCommand(): void {
    this.commandManager.addCommand(
      new RotateCommand(this, this.deltaAngle, this.isShifted),
    );
    this.deltaAngle = 0;
    this.timerIsOn = false;
  }

  rotationEvent(
    deltaAngle: number,
    isShifted: boolean = false,
    pivot?: Point,
  ): void {
    if (this.timerIsOn) {
      clearTimeout(this.timer);
      this.timerIsOn = false;
      if (this.isShifted !== isShifted && this.deltaAngle) {
        this.registerCommand();
      }
      this.isShifted = isShifted;
    }

    this.rotate(deltaAngle, isShifted, pivot);

    this.deltaAngle += deltaAngle;
    this.timerIsOn = true;
    this.timer = setTimeout(() => this.registerCommand(), ROTATE_WHEEL_TIME);
  }

  rotate(deltaAngle: number, isShifted: boolean = false, pivot?: Point): void {
    for (const shape of this.shapes) {
      shape.rotate(deltaAngle, isShifted, this.center);
    }
    if (!isShifted) {
      super.rotate(deltaAngle);
    } else {
      this.transformMatrix = [
        [1, 0],
        [0, 1],
      ];
      this.updateRectangle();
      this.updateCircle();
    }
  }

  delete(): void {
    super.delete();
    this.renderer.removeChild(this.svgG, this.htmlElement);
    this.removeCircles();
    this.isDrawn = false;
  }

  applyMovement(
    temporaryTransform: number[][],
    temporaryDisplacement: number[][],
  ): void {
    for (const shape of this.shapes) {
      const newOrigin = this.matrixMultiplication(temporaryTransform, [
        [shape.origin.x - this.origin.x],
        [shape.origin.y - this.origin.y],
      ]);
      shape.origin = {
        x: this.origin.x + newOrigin[0][0] + temporaryDisplacement[0][0],
        y: this.origin.y + newOrigin[1][0] + temporaryDisplacement[1][0],
      };
      shape.transformMatrix = this.matrixMultiplication(
        temporaryTransform,
        shape.transformMatrix,
      );
      shape.updateRender();
    }
  }

  applyMovementOnSelect(
    temporaryTransform: number[][],
    temporaryDisplacement: number[][],
  ): void {
    this.origin = {
      x: this.origin.x + temporaryDisplacement[0][0],
      y: this.origin.y + temporaryDisplacement[1][0],
    };
    const newSize = this.matrixMultiplication(
      this.matrixMultiplication(
        this.inverseSquareMatrix(this.transformMatrix),
        this.matrixMultiplication(temporaryTransform, this.transformMatrix),
      ),
      [[this.size.x], [this.size.y]],
    );
    this.size = {
      x: Math.abs(newSize[0][0]),
      y: Math.abs(newSize[1][0]),
    };
    this.transformMatrix = this.matrixMultiplication(this.transformMatrix, [
      [Math.sign(newSize[0][0]), 0],
      [0, Math.sign(newSize[1][0])],
    ]);
    this.renderRectangle();
    this.updateCircle();
  }
}

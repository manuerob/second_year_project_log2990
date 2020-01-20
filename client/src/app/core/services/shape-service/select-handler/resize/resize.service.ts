import { Injectable } from '@angular/core';
import { SelectObject } from 'src/app/core/models/shapes/select-object';
import { Point } from 'src/app/core/models/type';
import {
  MIDDLE,
  OPPOSITE,
  ORIGIN,
  SMALL_SIZE,
} from '../../../../../../../../common/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  selection: SelectObject;
  isActive: boolean;
  startingPoint: Point;
  corner: Point;
  inverseTransform: number[][];
  temporaryTransformation: number[][];
  temporaryDisplacement: number[][];
  constructor() {
    this.isActive = false;
  }

  matrixMultiplication(matM: number[][], matN: number[][]): number[][] {
    return this.selection.matrixMultiplication(matM, matN);
  }

  startResize(event: MouseEvent, corner: Point, selection: SelectObject): void {
    this.selection = selection;
    this.corner = corner;
    this.initializeValues();

    this.inverseTransform = this.selection.inverseSquareMatrix(
      this.selection.transformMatrix,
    );

    this.startingPoint = { x: event.layerX, y: event.layerY };
  }

  private initializeValues(): void {
    this.isActive = true;

    this.temporaryTransformation = [
      [1, 0],
      [0, 1],
    ];
    this.temporaryDisplacement = [[0], [0]];
    this.temporaryTransformation = [
      [1, 0],
      [0, 1],
    ];
  }

  onMovement(event: MouseEvent): void {
    let matVector = this.matrixMultiplication(this.inverseTransform, [
      [event.layerX - this.startingPoint.x],
      [event.layerY - this.startingPoint.y],
    ]);
    const newTransform: number[][] = [
      [0, 0],
      [0, 0],
    ];

    this.setXTransformation(newTransform, matVector, event);

    this.setYTransformation(newTransform, matVector, event);

    if (event.shiftKey && !event.altKey) {
      this.keepProportion(newTransform, matVector);
    }

    this.temporaryTransformation = this.matrixMultiplication(
      this.matrixMultiplication(this.selection.transformMatrix, newTransform),
      this.inverseTransform,
    );

    matVector = this.matrixMultiplication(
      this.selection.transformMatrix,
      matVector,
    );

    this.applyTemporaryTranformation(matVector);
    this.temporaryDisplacement = matVector;
  }

  private applyTemporaryTranformation(matVector: number[][]): void {
    for (const shape of this.selection.shapes) {
      const tempMatrix: number[][] = this.matrixMultiplication(
        this.temporaryTransformation,
        shape.transformMatrix,
      );
      const newOrigin = this.matrixMultiplication(
        this.temporaryTransformation,
        [
          [shape.origin.x - this.selection.origin.x],
          [shape.origin.y - this.selection.origin.y],
        ],
      );
      this.applyRendererTransform(
        shape.htmlElement,
        tempMatrix,
        matVector,
        newOrigin,
      );
    }
    const tempMatrix2: number[][] = this.matrixMultiplication(
      this.temporaryTransformation,
      this.selection.transformMatrix,
    );
    this.applyRendererTransform(
      this.selection.htmlElement,
      tempMatrix2,
      matVector,
    );
    for (const circle of this.selection.circles) {
      this.applyRendererTransform(circle, tempMatrix2, matVector);
    }
  }

  private notZero(value: number): number {
    return value ? value : SMALL_SIZE;
  }

  private setXTransformation(
    newTransform: number[][],
    matVector: number[][],
    event: MouseEvent,
  ): void {
    switch (this.corner.x) {
      case MIDDLE: {
        newTransform[0][0] = 1;
        matVector[0][0] = 0;
        break;
      }
      case ORIGIN: {
        if (event.altKey) {
          newTransform[0][0] =
            this.notZero(this.selection.size.x - matVector[0][0] * 2) /
            this.selection.size.x;
        } else {
          newTransform[0][0] =
            this.notZero(this.selection.size.x - matVector[0][0]) / this.selection.size.x;
        }
        break;
      }
      case OPPOSITE: {
        if (event.altKey) {
          newTransform[0][0] =
            this.notZero(this.selection.size.x + matVector[0][0] * 2) /
            this.selection.size.x;
          matVector[0][0] = -matVector[0][0];
        } else {
          newTransform[0][0] =
            this.notZero(this.selection.size.x + matVector[0][0]) / this.selection.size.x;
          matVector[0][0] = 0;
        }
        break;
      }
    }
  }

  private setYTransformation(
    newTransform: number[][],
    matVector: number[][],
    event: MouseEvent,
  ): void {
    switch (this.corner.y) {
      case MIDDLE: {
        newTransform[1][1] = 1;
        matVector[1][0] = 0;
        break;
      }
      case ORIGIN: {
        if (event.altKey) {
          newTransform[1][1] =
            this.notZero(this.selection.size.y - matVector[1][0] * 2) /
            this.selection.size.y;
        } else {
          newTransform[1][1] =
            this.notZero(this.selection.size.y - matVector[1][0]) / this.selection.size.y;
        }
        break;
      }
      case OPPOSITE: {
        if (event.altKey) {
          newTransform[1][1] =
            this.notZero(this.selection.size.y + matVector[1][0] * 2) /
            this.selection.size.y;
          matVector[1][0] = -matVector[1][0];
        } else {
          newTransform[1][1] =
            this.notZero(this.selection.size.y + matVector[1][0]) / this.selection.size.y;
          matVector[1][0] = 0;
        }
        break;
      }
    }
  }

  private applyRendererTransform(
    htmlElement: SVGGraphicsElement,
    tempMatrix: number[][],
    matVector: number[][],
    newOrigin: number[][] = [[0], [0]],
  ): void {
    this.selection.setRenderer(htmlElement, [
      [
        'transform',
        'matrix(' +
          tempMatrix[0][0] +
          ',' +
          tempMatrix[1][0] +
          ',' +
          tempMatrix[0][1] +
          ',' +
          tempMatrix[1][1] +
          ',' +
          (this.selection.origin.x + newOrigin[0][0] + matVector[0][0]) +
          ', ' +
          (this.selection.origin.y + newOrigin[1][0] + matVector[1][0]) +
          ')',
      ],
    ]);
  }

  private keepProportion(
    newTransform: number[][],
    matVector: number[][],
  ): void {
    if (this.corner.x !== MIDDLE && this.corner.y !== MIDDLE) {
      const maxValue = Math.max(
        Math.abs(newTransform[0][0]),
        Math.abs(newTransform[1][1]),
      );
      if (this.corner.x === ORIGIN) {
        matVector[0][0] =
          matVector[0][0] -
          this.selection.size.x *
            (maxValue * Math.sign(newTransform[0][0]) - newTransform[0][0]);
      }
      if (this.corner.y === ORIGIN) {
        matVector[1][0] =
          matVector[1][0] -
          this.selection.size.y *
            (maxValue * Math.sign(newTransform[1][1]) - newTransform[1][1]);
      }
      newTransform[0][0] = maxValue * Math.sign(newTransform[0][0]);
      newTransform[1][1] = maxValue * Math.sign(newTransform[1][1]);
    }
  }

  endMovement(): void {
    this.isActive = false;
    this.selection.applyMovement(
      this.temporaryTransformation,
      this.temporaryDisplacement,
    );
    this.selection.applyMovementOnSelect(
      this.temporaryTransformation,
      this.temporaryDisplacement,
    );

  }
}

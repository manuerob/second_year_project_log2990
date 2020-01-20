import { SelectObject } from 'src/app/core/models/shapes/select-object';
import ICommand from '../../../models/i-command';

export class ResizeCommand implements ICommand {
  shape: SelectObject;
  temporaryTransform: number[][];
  temporaryDisplacement: number[][];
  constructor(
    shape: SelectObject,
    temporaryTransform: number[][],
    temporaryDisplacement: number[][],
  ) {
    this.shape = shape;
    this.temporaryTransform = temporaryTransform;
    this.temporaryDisplacement = temporaryDisplacement;
  }
  execute(): void {
    this.shape.applyMovement(
      this.temporaryTransform,
      this.temporaryDisplacement,
    );
    this.shape.applyMovementOnSelect(
      this.temporaryTransform,
      this.temporaryDisplacement,
    );
  }
  undo(): void {
    this.shape.applyMovement(
      this.shape.inverseSquareMatrix(this.temporaryTransform),
      [
        [-this.temporaryDisplacement[0][0]],
        [-this.temporaryDisplacement[1][0]],
      ],
    );
    this.shape.applyMovementOnSelect(
      this.shape.inverseSquareMatrix(this.temporaryTransform),
      [
        [-this.temporaryDisplacement[0][0]],
        [-this.temporaryDisplacement[1][0]],
      ],
    );
  }
}

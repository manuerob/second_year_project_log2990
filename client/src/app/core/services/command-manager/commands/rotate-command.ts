import ICommand from '../../../models/i-command';
import { ShapeAbs } from '../../../models/shapes/shape-abs';

export class RotateCommand implements ICommand {
  shape: ShapeAbs;
  angle: number;
  isShifted: boolean;
  constructor(shape: ShapeAbs, angle: number, isShifted: boolean) {
    this.shape = shape;
    this.angle = angle;
    this.isShifted = isShifted;
  }
  execute(): void {
    this.shape.rotate(this.angle, this.isShifted);
  }
  undo(): void {
    this.shape.rotate(-this.angle, this.isShifted);
  }
}

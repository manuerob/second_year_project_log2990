import { Point } from 'src/app/core/models/type';
import ICommand from '../../../models/i-command';
import { ShapeAbs } from '../../../models/shapes/shape-abs';

export class SnapCommand implements ICommand {
  shape: ShapeAbs;
  displacement: Point;
  constructor(shape: ShapeAbs, displacement: Point) {
    this.shape = shape;
    this.displacement = displacement;
  }
  execute(): void {
    this.shape.moveShape(this.displacement);
  }
  undo(): void {
    this.shape.moveShape({ x: -this.displacement.x, y: -this.displacement.y });
  }
}

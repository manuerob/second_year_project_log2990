import { ShapeAbs } from '../../../models/shapes/shape-abs';
import ICommand from './../../../models/i-command';

export class CreateCommand implements ICommand {
  shape: ShapeAbs;
  constructor(shape: ShapeAbs) {
    this.shape = shape;
  }
  execute(): void {
    this.shape.render();
  }
  undo(): void {
    this.shape.delete();
  }
}

import ICommand from '../../../models/i-command';
import { ShapeAbs } from '../../../models/shapes/shape-abs';

export class DeleteCommand implements ICommand {
  shape: ShapeAbs;
  constructor(shape: ShapeAbs) {
    this.shape = shape;
  }
  execute(): void {
    this.shape.delete();
  }
  undo(): void {
    this.shape.render();
  }
}

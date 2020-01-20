import { Color } from 'src/app/core/models/color';
import ICommand from '../../../models/i-command';
import { ShapeAbs } from '../../../models/shapes/shape-abs';

export class ChangeSecondaryColor implements ICommand {
  shape: ShapeAbs;
  previousColor: Color;
  currentColor: Color;

  constructor(shape: ShapeAbs, color: Color) {
    this.shape = shape;
    this.currentColor = color;
  }

  execute(): void {
    this.previousColor = this.shape.changeSecondaryColor(this.currentColor);
  }

  undo(): void {
    this.shape.changeSecondaryColor(this.previousColor);
  }
}

import { ShapeAbs } from './shapes/shape-abs';

export default interface ICommand {
  shape: ShapeAbs;
  execute(): void;
  undo(): void;
}

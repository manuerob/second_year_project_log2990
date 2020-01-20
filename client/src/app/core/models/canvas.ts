import { Color } from './color';
import { ShapeAbs } from './shapes/shape-abs';
import { Point } from './type';

const WHITE: Color = new Color();
const GREYSHADE: Color = new Color();
const SMALLGRID: Point = { x: 10, y: 10 };

export default class Canvas {
  shapes: ShapeAbs[];
  size: Point;
  color: Color;
  showGrid: boolean;
  gridSize: Point;
  gridColor: Color;

  constructor(size: Point, color: Color = WHITE) {
    this.shapes = [];
    this.showGrid = false;
    this.size = size;
    this.color = color;
    this.gridSize = SMALLGRID;
    this.gridColor = GREYSHADE;
  }
}

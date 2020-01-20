import { ShapeAbs } from './shapes/shape-abs';
import { SimpleShapeAbs } from './shapes/simple-shape';

export interface Graph {
  title: string;
  tags: string[];
  height: number;
  width: number;
  backgroundColor: string;
  id: string;
  htmlElement: string;
  shapes: Map<SVGGraphicsElement, ShapeAbs>;
  createdAt: number;
}
export interface Graph2 {
  title: string;
  height: number;
  width: number;
  backgroundColor: string;
  tags: string[];
  id: string;
  htmlElement: string;
  shapes: SimpleShapeAbs[];
  createdAt: number;
}

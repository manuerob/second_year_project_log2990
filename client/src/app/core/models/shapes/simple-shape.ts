import { Color } from '../color';
import { Point } from '../type';

export interface SimpleShapeAbs {
  htmlElement: SVGGraphicsElement;
  svgG: SVGGraphicsElement;
  id: number;
  origin: Point;
  size: Point;
  angle: number;
  transformMatrix: number[][];
  shapeExportName: string;
}

export interface SimpleShape extends SimpleShapeAbs {
  color: Color;
  strokeWidth: number;
}

export interface SimpleGeometric extends SimpleShape {
  outColor: Color;
  plotType: string;
}

// tslint:disable-next-line: no-empty-interface
export interface SimpleRectangle extends SimpleGeometric {}

// tslint:disable-next-line: no-empty-interface
export interface SimpleEllipse extends SimpleGeometric {}

export interface SimplePolygon extends SimpleGeometric {
  linePoints: Point[];
  sideCount: number;
}

export interface SimpleTracingLineStrategy extends SimpleShape {
  linePoints: Point[];
}

// tslint:disable-next-line: no-empty-interface
export interface SimplePencil extends SimpleTracingLineStrategy {}

export interface SimpleBrush extends SimpleTracingLineStrategy {
  textureName: string;
}

export interface SimpleLine extends SimpleTracingLineStrategy {
  lineType: string;
  lineJoint: string;
  isClosed: boolean;
  markerRef: SVGGraphicsElement;
  jointSize: number;
}

export interface SimplePen extends SimpleTracingLineStrategy {
  strokeWidths: number[];
}

export interface SimpleSpray extends SimpleTracingLineStrategy {
  linePointRadiuses: number[];
}

export interface SimpleStamp extends SimpleShapeAbs {
  stampChoice: string;
  scaleFactor: number;
}

export interface SimpleText extends SimpleShapeAbs {
  tspanValues: string[];
  tspans: SVGGraphicsElement[];
  currentSpanCount: number;
  padding: number;
  color: Color;
  mutator: string;
  font: string;
  fontSize: number;
  alignment: string;
}

export interface SimpleFeather extends SimpleTracingLineStrategy {
  angles: number[];
  strokeLength: number;
}

export interface SimpleBucket extends SimpleGeometric {
  borderPoints: Point[];
  innerPoints: Point[];
}

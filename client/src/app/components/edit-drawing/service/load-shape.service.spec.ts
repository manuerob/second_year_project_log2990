import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RendererFactory2 } from '@angular/core';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { Color } from 'src/app/core/models/color';
import { BrushObject } from 'src/app/core/models/shapes/brush-object';
import { EllipseObject } from 'src/app/core/models/shapes/ellipse-object';
import { LineObject } from 'src/app/core/models/shapes/line-object';
import { PenObject } from 'src/app/core/models/shapes/pen-object';
import { PencilObject } from 'src/app/core/models/shapes/pencil-object';
import { PolygonObject } from 'src/app/core/models/shapes/polygon-object';
import { RectangleObject } from 'src/app/core/models/shapes/rectangle-object';
import {
  SimpleBrush,
  SimpleEllipse,
  SimpleLine,
  SimplePen,
  SimplePencil,
  SimplePolygon,
  SimpleRectangle,
  SimpleShape,
  SimpleStamp,
  SimpleText,
} from 'src/app/core/models/shapes/simple-shape';
import { StampObject } from 'src/app/core/models/shapes/stamp-object';
import { TextObject } from 'src/app/core/models/shapes/text-object';
import { Point } from 'src/app/core/models/type';
import { ColorService } from 'src/app/core/services/color/color.service';
import { CommandManagerService } from 'src/app/core/services/command-manager/command-manager.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { ShapeDependencyService } from 'src/app/core/services/shape-dependency/shape-dependency.service';
import { DisplayShapesService } from '../../attributs/display-shapes/service/display-shapes.service';
import { ToolService } from '../../toolbar/service/tool.service';
import { LoadShapeService } from './load-shape.service';

describe('LoadShapeService', () => {
  let service: LoadShapeService;
  let shapeDependencyService: ShapeDependencyService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DrawingService,
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ToolService,
        CommandManagerService,
        DisplayShapesService,
        ColorService,
        ShapeDependencyService,
      ],
    }).compileComponents(),
  );
  beforeEach(() => {
    service = TestBed.get(LoadShapeService);
    shapeDependencyService = TestBed.get(ShapeDependencyService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a pencil', () => {
    const pencilInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'PencilObject',
      color: {} as Color,
      strokeWidth: 0,
      linePoints: [{} as Point, {} as Point],
    } as SimplePencil;

    const expectedOutput = new PencilObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('polyline', 'svg'),
      pencilInfo.color,
      pencilInfo.linePoints[0],
      pencilInfo.strokeWidth,
    );
    expectedOutput.origin = pencilInfo.origin;
    expectedOutput.size = pencilInfo.size;
    expectedOutput.linePoints = pencilInfo.linePoints;
    expectedOutput.angle = pencilInfo.angle;
    const shape = service.loadShape(pencilInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
      expect(shape.angle).toEqual(expectedOutput.angle);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create a rectangle', () => {
    const rectangleInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'RectangleObject',
      color: {} as Color,
      outColor: {} as Color,
      strokeWidth: 2,
      plotType: 'dhhd',
    } as SimpleRectangle;

    const expectedOutput = new RectangleObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('rect', 'svg'),
      rectangleInfo.color,
      rectangleInfo.outColor,
      rectangleInfo.origin,
      rectangleInfo.size,
      rectangleInfo.strokeWidth,
      rectangleInfo.plotType,
    );
    expectedOutput.origin = rectangleInfo.origin;
    expectedOutput.size = rectangleInfo.size;
    expectedOutput.angle = rectangleInfo.angle;
    const shape = service.loadShape(rectangleInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
      expect(shape.angle).toEqual(expectedOutput.angle);
    } else {
      expect(shape).toEqual(null);
    }
  });
  it('should create an ellipse', () => {
    const ellipseInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'EllipseObject',
      color: {} as Color,
      outColor: {} as Color,
      strokeWidth: 2,
      plotType: 'dhhd',
    } as SimpleEllipse;

    const expectedOutput = new EllipseObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('rect', 'svg'),
      ellipseInfo.color,
      ellipseInfo.outColor,
      ellipseInfo.origin,
      ellipseInfo.size,
      ellipseInfo.strokeWidth,
      ellipseInfo.plotType,
    );
    expectedOutput.origin = ellipseInfo.origin;
    expectedOutput.size = ellipseInfo.size;
    expectedOutput.angle = ellipseInfo.angle;
    const shape = service.loadShape(ellipseInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
      expect(shape.angle).toEqual(expectedOutput.angle);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create a  brush', () => {
    const brushInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'BrushObject',
      textureName: 'dhhd',
      linePoints: [{} as Point, {} as Point],
    } as SimpleBrush;

    const expectedOutput = new BrushObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('polyline', 'svg'),
      brushInfo.color,
      brushInfo.linePoints[0],
      brushInfo.strokeWidth,
      brushInfo.textureName,
    );
    expectedOutput.origin = brushInfo.origin;
    expectedOutput.size = brushInfo.size;
    expectedOutput.angle = brushInfo.angle;
    const shape = service.loadShape(brushInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create a line', () => {
    const lineInfo = ({
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'LineObject',
      color: {} as Color,
      lineType: 'dhhd',
      lineJoint: 'adgj',
      isClosed: false,
      markerRef: {} as SVGGraphicsElement,
      jointSize: 1,
      linePoints: [{} as Point, {} as Point],
    } as unknown) as SimpleLine;

    const expectedOutput = new LineObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('path', 'svg'),
      lineInfo.color,
      lineInfo.linePoints[0],
      lineInfo.strokeWidth,
      lineInfo.lineType,
      lineInfo.lineJoint,
      lineInfo.jointSize,
    );
    expectedOutput.origin = lineInfo.origin;
    expectedOutput.size = lineInfo.size;
    expectedOutput.angle = lineInfo.angle;
    const shape = service.loadShape(lineInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create an ellipse', () => {
    const ellipseInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'EllipseObject',
      color: {} as Color,
      outColor: {} as Color,
      strokeWidth: 2,
      plotType: 'dhhd',
    } as SimpleEllipse;

    const expectedOutput = new EllipseObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('rect', 'svg'),
      ellipseInfo.color,
      ellipseInfo.outColor,
      ellipseInfo.origin,
      ellipseInfo.size,
      ellipseInfo.strokeWidth,
      ellipseInfo.plotType,
    );
    expectedOutput.origin = ellipseInfo.origin;
    expectedOutput.size = ellipseInfo.size;
    expectedOutput.angle = ellipseInfo.angle;
    const shape = service.loadShape(ellipseInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
      expect(shape.angle).toEqual(expectedOutput.angle);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create a polygon', () => {
    const polygonInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'PolygonObject',
      color: {} as Color,
      outColor: {} as Color,
      strokeWidth: 2,
      plotType: 'dhhd',
    } as SimplePolygon;

    const expectedOutput = new PolygonObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('polygon', 'svg'),
      polygonInfo.color,
      polygonInfo.outColor,
      polygonInfo.origin,
      polygonInfo.size,
      polygonInfo.strokeWidth,
      polygonInfo.plotType,
      polygonInfo.sideCount,
      polygonInfo.angle,
    );
    expectedOutput.origin = polygonInfo.origin;
    expectedOutput.size = polygonInfo.size;
    expectedOutput.angle = polygonInfo.angle;
    const shape = service.loadShape(polygonInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
      expect(shape.angle).toEqual(expectedOutput.angle);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create a stamp', () => {
    const stampInfo = ({
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'StampObject',
      color: {} as Color,
      outColor: {} as Color,
      strokeWidth: 2,
      plotType: 'dhhd',
    } as unknown) as SimpleStamp;

    const expectedOutput = new StampObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('image', 'svg'),
      stampInfo.origin,
      stampInfo.scaleFactor,
      stampInfo.angle,
      0,
    );
    expectedOutput.size = stampInfo.size;
    expectedOutput.stampChoice = stampInfo.stampChoice;
    const shape = service.loadShape(stampInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
      expect(shape.angle).toEqual(expectedOutput.angle);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should create a pen ', () => {
    const penInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'PenObject',
      strokeWidths: [2, 3],
      linePoints: [{} as Point, {} as Point, {} as Point],
    } as SimplePen;

    const expectedOutput = new PenObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('g', 'svg'),
      penInfo.color,
      penInfo.linePoints[0],
      penInfo.strokeWidth,
    );
    expectedOutput.origin = penInfo.origin;
    expectedOutput.size = penInfo.size;
    expectedOutput.linePoints = penInfo.linePoints;
    expectedOutput.strokeWidths = penInfo.strokeWidths;

    let i = 1;
    for (const width of expectedOutput.strokeWidths) {
      expectedOutput.penStrokes.push(
        expectedOutput.renderer.createElement('polyline', 'svg'),
      );

      expectedOutput.setRenderer(expectedOutput.penStrokes[i - 1], [
        ['stroke-width', width.toString()],
        ['points', expectedOutput.lineData(i)],
      ]);

      expectedOutput.renderer.appendChild(
        expectedOutput.htmlElement,
        expectedOutput.penStrokes[expectedOutput.penStrokes.length - 1],
      );
      i++;
    }
    const shape = service.loadShape(penInfo);
    if (shape) {
      expect(shape.origin).toEqual(expectedOutput.origin);
      expect(shape.size).toEqual(expectedOutput.size);
    } else {
      expect(shape).toEqual(null);
    }
  });

  it('should return null ', () => {
    const noInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: '',
    } as SimpleShape;

    const shape = service.loadShape(noInfo);

    expect(shape).toEqual(null);
  });

  it('should create a text object ', () => {
    const textInfo = {
      htmlElement: {} as SVGGraphicsElement,
      svgG: {} as SVGGraphicsElement,
      id: 0,
      origin: {} as Point,
      size: {} as Point,
      angle: 1,
      shapeExportName: 'TextObject',
      strokeWidths: [2, 3],
      linePoints: [{} as Point, {} as Point, {} as Point],

      tspanValues: [{} as string, {} as string, {} as string],
      tspans: {} as SVGGraphicsElement[],
      currentSpanCount: 2,
      padding: 10,
      color: {} as Color,
      mutator: 'string',
      font: 'string',
      fontSize: 5,
      alignment: 'left',
      transformMatrix: [] as number[][],
    } as SimpleText;

    const expectedOutput = new TextObject(
      shapeDependencyService,
      shapeDependencyService.renderer.createElement('text', 'svg'),
      textInfo.origin,
      textInfo.size,
      textInfo.color,
      textInfo.mutator,
      textInfo.font,
      textInfo.fontSize,
      textInfo.alignment,
    );
    expectedOutput.tspanValues = textInfo.tspanValues;
    expectedOutput.currentSpanCount = textInfo.currentSpanCount;
    expectedOutput.padding = textInfo.padding;

    for (const iterator of expectedOutput.tspanValues) {
      const tspan: SVGGraphicsElement = shapeDependencyService.renderer.createElement(
        'tspan',
        'svg',
      );

      shapeDependencyService.renderer.appendChild(
        expectedOutput.htmlElement,
        tspan,
      );
      tspan.innerHTML = iterator;
      expectedOutput.setRenderer(tspan, [
        ['dy', expectedOutput.fontSize.toString()],
        ['x', '0'],
        ['text-anchor', expectedOutput.alignment],
      ]);
      expectedOutput.tspans.push(tspan);
    }
    const classStyle = `
        font: ${expectedOutput.mutator} ${expectedOutput.fontSize}px ${expectedOutput.font}; stroke-fill: #031;`;
    shapeDependencyService.renderer.setAttribute(
      expectedOutput.htmlElement,
      'style',
      classStyle,
    );

    const shape = service.loadShape(textInfo);
    if (shape) {
      expect(shape.size).toEqual(expectedOutput.size);
    } else {
      expect(shape).toEqual(null);
    }
  });
});

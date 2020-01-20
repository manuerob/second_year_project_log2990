import { Injectable } from '@angular/core';
import { BrushObject } from 'src/app/core/models/shapes/brush-object';
import { BucketObject } from 'src/app/core/models/shapes/bucket-object';
import { EllipseObject } from 'src/app/core/models/shapes/ellipse-object';
import { FeatherObject } from 'src/app/core/models/shapes/feather-object';
import { LineObject } from 'src/app/core/models/shapes/line-object';
import { PenObject } from 'src/app/core/models/shapes/pen-object';
import { PencilObject } from 'src/app/core/models/shapes/pencil-object';
import { PolygonObject } from 'src/app/core/models/shapes/polygon-object';
import { RectangleObject } from 'src/app/core/models/shapes/rectangle-object';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import {
  SimpleBucket,
  SimpleEllipse,
  SimpleFeather,
  SimpleLine,
  SimplePen,
  SimplePencil,
  SimplePolygon,
  SimpleRectangle,
  SimpleShapeAbs,
  SimpleSpray,
  SimpleStamp,
  SimpleText,
} from 'src/app/core/models/shapes/simple-shape';
import { SpraypaintObject } from 'src/app/core/models/shapes/spraypaint-object';
import { StampObject } from 'src/app/core/models/shapes/stamp-object';
import { TextObject } from 'src/app/core/models/shapes/text-object';
import { Point } from 'src/app/core/models/type';
import { ShapeDependencyService } from 'src/app/core/services/shape-dependency/shape-dependency.service';
import { SimpleBrush } from './../../../core/models/shapes/simple-shape';

@Injectable({
  providedIn: 'root',
})
export class LoadShapeService {
  constructor(protected shapeDependency: ShapeDependencyService) {}

  loadShape(simpleShape: SimpleShapeAbs): ShapeAbs | null {
    switch (simpleShape.shapeExportName) {
      case 'PencilObject':
        const pencilInfo: SimplePencil = simpleShape as SimplePencil;
        const pencilObject = new PencilObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('polyline', 'svg'),
          pencilInfo.color,
          pencilInfo.linePoints[0],
          pencilInfo.strokeWidth,
        );

        pencilObject.origin = pencilInfo.origin;
        pencilObject.size = pencilInfo.size;
        pencilObject.linePoints = pencilInfo.linePoints;
        pencilObject.angle = pencilInfo.angle;
        pencilObject.transformMatrix = pencilInfo.transformMatrix;
        return pencilObject;

      case 'RectangleObject':
        const rectangleInfo: SimpleRectangle = simpleShape as SimpleRectangle;
        const recObject = new RectangleObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('rect', 'svg'),
          rectangleInfo.color,
          rectangleInfo.outColor,
          rectangleInfo.origin,
          rectangleInfo.size,
          rectangleInfo.strokeWidth,
          rectangleInfo.plotType,
        );

        recObject.origin = rectangleInfo.origin;
        recObject.size = rectangleInfo.size;
        recObject.angle = rectangleInfo.angle;
        recObject.transformMatrix = rectangleInfo.transformMatrix;
        return recObject;

      case 'EllipseObject':
        const ellipseInfo: SimpleEllipse = simpleShape as SimpleEllipse;
        const ellipseObject = new EllipseObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('rect', 'svg'),
          ellipseInfo.color,
          ellipseInfo.outColor,
          ellipseInfo.origin,
          ellipseInfo.size,
          ellipseInfo.strokeWidth,
          ellipseInfo.plotType,
        );

        ellipseObject.origin = ellipseInfo.origin;
        ellipseObject.size = ellipseInfo.size;
        ellipseObject.angle = ellipseInfo.angle;
        ellipseObject.transformMatrix = ellipseInfo.transformMatrix;
        return ellipseObject;

      case 'LineObject':
        const lineInfo: SimpleLine = simpleShape as SimpleLine;
        const lineObject = new LineObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('path', 'svg'),
          lineInfo.color,
          lineInfo.linePoints[0],
          lineInfo.strokeWidth,
          lineInfo.lineType,
          lineInfo.lineJoint,
          lineInfo.jointSize,
        );

        lineObject.linePoints = lineInfo.linePoints;
        lineObject.origin = lineInfo.origin;
        lineObject.size = lineInfo.size;
        lineObject.isClosed = lineInfo.isClosed;
        lineObject.transformMatrix = lineInfo.transformMatrix;

        return lineObject;

      case 'BrushObject':
        const brushInfo: SimpleBrush = simpleShape as SimpleBrush;
        const brushObject = new BrushObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('polyline', 'svg'),
          brushInfo.color,
          brushInfo.linePoints[0],
          brushInfo.strokeWidth,
          brushInfo.textureName,
        );

        brushObject.linePoints = brushInfo.linePoints;
        brushObject.origin = brushInfo.origin;
        brushObject.size = brushInfo.size;
        brushObject.transformMatrix = brushInfo.transformMatrix;
        return brushObject;

      case 'PenObject': {
        const penInfo: SimplePen = simpleShape as SimplePen;

        const penObject = new PenObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('g', 'svg'),
          penInfo.color,
          penInfo.linePoints[0],
          penInfo.strokeWidth,
        );

        penObject.linePoints = penInfo.linePoints;
        penObject.origin = penInfo.origin;
        penObject.size = penInfo.size;
        penObject.strokeWidths = penInfo.strokeWidths;
        penObject.transformMatrix = penInfo.transformMatrix;
        let i = 1;
        for (const width of penObject.strokeWidths) {
          penObject.penStrokes.push(
            penObject.renderer.createElement('polyline', 'svg'),
          );
          penObject.setRenderer(penObject.penStrokes[i - 1], [
            ['stroke-width', width.toString()],
            ['points', penObject.lineData(i)],
          ]);
          penObject.renderer.appendChild(
            penObject.htmlElement,
            penObject.penStrokes[penObject.penStrokes.length - 1],
          );
          i++;
        }

        return penObject;
      }
      case 'PolygonObject': {
        const polygonInfo: SimplePolygon = simpleShape as SimplePolygon;
        const polygonObject = new PolygonObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('polygon', 'svg'),
          polygonInfo.color,
          polygonInfo.outColor,
          polygonInfo.origin,
          polygonInfo.size,
          polygonInfo.strokeWidth,
          polygonInfo.plotType,
          polygonInfo.sideCount,
          polygonInfo.angle,
        );

        polygonObject.origin = polygonInfo.origin;
        polygonObject.size = polygonInfo.size;
        polygonObject.angle = polygonInfo.angle;
        polygonObject.transformMatrix = polygonInfo.transformMatrix;
        return polygonObject;
      }
      case 'StampObject': {
        const stampInfo: SimpleStamp = simpleShape as SimpleStamp;
        const stampObject = new StampObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('image', 'svg'),
          stampInfo.origin,
          stampInfo.scaleFactor,
          stampInfo.angle,
          0,
        );
        stampObject.size = stampInfo.size;
        stampObject.stampChoice = stampInfo.stampChoice;
        stampObject.transformMatrix = stampInfo.transformMatrix;

        return stampObject;
      }

      case 'TextObject': {
        return this.createNewText(simpleShape);
      }

      case 'SpraypaintObject': {
        const spraypaintInfo: SimpleSpray = simpleShape as SimpleSpray;
        const spray: SpraypaintObject = new SpraypaintObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('g', 'svg'),
          spraypaintInfo.color,
          spraypaintInfo.linePoints[0],
          spraypaintInfo.strokeWidth,
        );
        spray.origin = spraypaintInfo.origin;
        spray.size = spraypaintInfo.size;
        spray.linePoints = spraypaintInfo.linePoints;
        spray.linePointRadiuses = spraypaintInfo.linePointRadiuses;
        spray.transformMatrix = spraypaintInfo.transformMatrix;
        let pointCount = 0;
        spray.linePoints.forEach((point: Point) => {
          const paint = spray.renderer.createElement('circle', 'svg');
          spray.setRenderer(paint, [
            ['cx', point.x.toString()],
            ['cy', point.y.toString()],
            ['r', spray.linePointRadiuses[pointCount].toString()],
            ['stroke', 'none'],
          ]);
          pointCount++;
          spray.paintScatters.push(paint);
          spray.renderer.appendChild(spray.htmlElement, paint);
          spray.addToRenderer();
        });
        return spray;
      }

      case 'BucketObject': {
        const bucketInfo: SimpleBucket = simpleShape as SimpleBucket;
        const bucket: BucketObject = new BucketObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('g', 'svg'),
          bucketInfo.color,
          bucketInfo.outColor,
          bucketInfo.origin,
          bucketInfo.size,
          bucketInfo.strokeWidth,
          bucketInfo.plotType,
          bucketInfo.borderPoints,
          bucketInfo.innerPoints,
        );
        bucket.transformMatrix = bucketInfo.transformMatrix;

        return bucket;
      }

      case 'FeatherObject': {
        const featherInfo: SimpleFeather = simpleShape as SimpleFeather;
        const featherObject = new FeatherObject(
          this.shapeDependency,
          this.shapeDependency.renderer.createElement('g', 'svg'),
          featherInfo.color,
          featherInfo.linePoints[0],
          featherInfo.strokeWidth,
          featherInfo.strokeLength,
        );
        featherObject.size = featherInfo.size;
        featherObject.origin = featherInfo.origin;
        featherObject.angle = featherInfo.angle;
        featherObject.angles = featherInfo.angles;
        featherObject.linePoints = featherInfo.linePoints;
        featherObject.transformMatrix = featherInfo.transformMatrix;

        let i = 0;
        for (const angle of featherObject.angles) {
          if (i < featherInfo.linePoints.length - 2) {
            featherObject.featherStrokes.push(
              featherObject.renderer.createElement('polyline', 'svg'),
            );
            featherObject.setRenderer(
              featherObject.featherStrokes[
                featherObject.featherStrokes.length - 1
              ],
              [
                [
                  'points',
                  featherObject.lineData(
                    i + 2,
                    angle,
                    featherObject.strokeWidth,
                  ),
                ],
              ],
            );
            featherObject.renderer.appendChild(
              featherObject.htmlElement,
              featherObject.featherStrokes[
                featherObject.featherStrokes.length - 1
              ],
            );
            i++;
          }
        }

        return featherObject;
      }
      default:
        return null;
    }
  }

  createNewText(simpleShape: SimpleShapeAbs): TextObject {
    const textInfo: SimpleText = simpleShape as SimpleText;
    const textObject: TextObject = new TextObject(
      this.shapeDependency,
      this.shapeDependency.renderer.createElement('text', 'svg'),
      textInfo.origin,
      textInfo.size,
      textInfo.color,
      textInfo.mutator,
      textInfo.font,
      textInfo.fontSize,
      textInfo.alignment,
    );
    textObject.tspanValues = textInfo.tspanValues;
    textObject.currentSpanCount = textInfo.currentSpanCount;
    textObject.padding = textInfo.padding;
    textObject.transformMatrix = textInfo.transformMatrix;

    for (const iterator of textObject.tspanValues) {
      const tspan: SVGGraphicsElement = this.shapeDependency.renderer.createElement(
        'tspan',
        'svg',
      );

      this.shapeDependency.renderer.appendChild(textObject.htmlElement, tspan);

      tspan.innerHTML = iterator;
      textObject.setRenderer(tspan, [
        ['dy', textObject.fontSize.toString()],
        ['x', '0'],
        ['text-anchor', textObject.alignment],
      ]);
      textObject.tspans.push(tspan);
    }
    const classStyle = `
        font: ${textObject.mutator} ${textObject.fontSize}px ${textObject.font}; stroke-fill: #031;`;
    this.shapeDependency.renderer.setAttribute(
      textObject.htmlElement,
      'style',
      classStyle,
    );

    return textObject;
  }
}

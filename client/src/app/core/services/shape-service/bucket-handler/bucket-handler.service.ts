import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { BucketObject } from 'src/app/core/models/shapes/bucket-object';
import {
  ALPHA_VALUE,
  BLUE_VALUE,
  GREEN_VALUE,
  MAXIMUM_COLOR_DISTANCE_3D,
  RED_VALUE,
  RGBA_VALUES,
} from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';
import { PERCENTAGE } from './../../../../../../../common/constants/constants';
import { Point } from './../../../models/type';

interface Rgba {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface Pixel {
  position: number;
  color: Rgba;
}

@Injectable({
  providedIn: 'root',
})
export class BucketHandlerService extends ShapeHandlerService implements IShapeHandler {
  canvasImage: CanvasImageSource;
  cx: CanvasRenderingContext2D | null;
  tempCanvas: HTMLCanvasElement;
  shape: BucketObject;
  canvasWidth: number;
  origin: Point;
  bottomRightPoint: Point;
  canvasHeight: number;
  canvasData: ImageData;
  lookupColor: Rgba;
  visitedPoints: Set<number>;
  pointsToVisit: Pixel[];
  pointsToKeep: Pixel[];
  borderPoints: Point[];
  innerPoints: Point[];

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.subscriptions.push(
      this.drawingService.width$.subscribe((width: number) => {
        this.canvasWidth = width;
      }),
      this.drawingService.height$.subscribe((height: number) => {
        this.canvasHeight = height;
      }),
    );
    this.tempCanvas = this.renderer.createElement('canvas');
    this.tempCanvas.width = this.canvasWidth;
    this.tempCanvas.height = this.canvasHeight;
    this.borderPoints = [];
    this.origin = { x: 0, y: 0 };
    this.initializeArrays();
  }

  getRgbaColorAtCoordonate(x: number, y: number): Pixel {
    const position = y * (this.canvasWidth * RGBA_VALUES) + x * RGBA_VALUES;
    return {
      position,
      color: {
        red: this.canvasData.data[position + RED_VALUE],
        green: this.canvasData.data[position + GREEN_VALUE],
        blue: this.canvasData.data[position + BLUE_VALUE],
        alpha: this.canvasData.data[position + ALPHA_VALUE],
      },
    };
  }

  fromPositionToCoordonate(position: number): Point {
    return {
      x: (position / RGBA_VALUES) % this.canvasWidth,
      y: Math.floor(position / RGBA_VALUES / this.canvasWidth),
    };
  }

  getRgbaColorAtPosition(position: number): Pixel {
    return {
      position,
      color: {
        red: this.canvasData.data[position + RED_VALUE],
        green: this.canvasData.data[position + GREEN_VALUE],
        blue: this.canvasData.data[position + BLUE_VALUE],
        alpha: this.canvasData.data[position + ALPHA_VALUE],
      },
    };
  }

  bufferToBase64(buf: number[]): string {
    const binstr = buf
      .map((value) => {
        return String.fromCharCode(value);
      })
      .join('');
    return btoa(binstr);
  }

  checkExtrems(currentPoint: Point): void {
    this.origin = {
      x: Math.min(this.origin.x, currentPoint.x),
      y: Math.min(this.origin.y, currentPoint.y),
    };
    this.bottomRightPoint = {
      x: Math.max(this.bottomRightPoint.x, currentPoint.x),
      y: Math.max(this.bottomRightPoint.y, currentPoint.y),
    };
  }

  isKeptColor(otherColor: Rgba): boolean {
    const colorDistance: number = Math.sqrt(
      Math.pow(otherColor.red - this.lookupColor.red, 2) +
      Math.pow(otherColor.green - this.lookupColor.green, 2) +
      Math.pow(otherColor.blue - this.lookupColor.blue, 2),
    );
    return colorDistance <= (this.attributs.tolerance / PERCENTAGE) * MAXIMUM_COLOR_DISTANCE_3D;
  }

  lookAroundPoint(pixel: Pixel): void {
    // get points around the pixel
    const neighbors = this.getNeighborPixel(pixel.position);
    for (const neighbor of neighbors) {
      if (!this.visitedPoints.has(neighbor.position)) {
        const point: Point = this.fromPositionToCoordonate(pixel.position);
        if (this.isKeptColor(neighbor.color)) {
          this.pointsToKeep.push(neighbor);
          this.pointsToVisit.push(neighbor);
          this.innerPoints.push(this.fromPositionToCoordonate(neighbor.position));
        } else {
          this.borderPoints.push(point);
        }
        this.checkExtrems(point);
        this.visitedPoints.add(neighbor.position);
      }
    }
  }

  getNeighborPixel(position: number): Pixel[] {
    // tslint:disable: naming-convention
    const LEFT_POINT = -RGBA_VALUES;
    const RIGHT_POINT = RGBA_VALUES;
    const BOTTOM_POINT = RGBA_VALUES * this.canvasWidth;
    const TOP_POINT = -RGBA_VALUES * this.canvasWidth;
    // tslint:enable: naming-convention

    const neighborPixel: Pixel[] = [
      this.getRgbaColorAtPosition(position + LEFT_POINT),
      this.getRgbaColorAtPosition(position + RIGHT_POINT),
      this.getRgbaColorAtPosition(position + TOP_POINT),
      this.getRgbaColorAtPosition(position + BOTTOM_POINT),
    ];
    return neighborPixel;
  }

  findPixelsAlike(initialPoint: Pixel): void {
    this.lookupColor = initialPoint.color;
    // initialize arrays with first pixel
    this.pointsToKeep.push(initialPoint);
    this.pointsToVisit.push(initialPoint);
    this.innerPoints.push(this.fromPositionToCoordonate(initialPoint.position));

    // start the algoritm
    while (this.pointsToVisit.length) {
      const currentPoint: Pixel | undefined = this.pointsToVisit.pop();
      if (currentPoint) {
        this.lookAroundPoint(currentPoint);
      }
    }

    if (this.cx) {
      this.cx.putImageData(this.canvasData, 0, 0);
    }

    this.createPolygon();
  }

  createPolygon(): void {
    this.shape = new BucketObject(
      this.shapeDependency,
      this.renderer.createElement('g', 'svg'),
      this.primaryColor,
      this.secondaryColor,
      this.origin,
      { x: this.bottomRightPoint.x - this.origin.x, y: this.bottomRightPoint.y - this.origin.y },
      this.attributs.width,
      this.attributs.plotType,
      this.borderPoints,
      this.innerPoints,
    );
    this.shape.end();
    this.shape.render();
    this.endShape();
  }

  onMouseDown(event: MouseEvent): void {
    this.origin = { x: event.layerX, y: event.layerY };
    this.bottomRightPoint = { x: event.layerX, y: event.layerY };
    this.cx = this.tempCanvas.getContext('2d');
    this.initializeArrays();
    if (this.cx) {
      this.canvasImage = new Image();
      this.canvasImage.height = this.canvasHeight;
      this.canvasImage.width = this.canvasWidth;

      const svgXml: string = new XMLSerializer().serializeToString(this.canvasRef.nativeElement);

      const svgBase64: string = btoa(svgXml);
      const headerBase64 = 'data:image/svg+xml;base64,';
      const fullImageBase64: string = headerBase64 + svgBase64;

      this.canvasImage.src = fullImageBase64;
      this.canvasImage.decode().then(() => {
        if (this.cx) {
          this.cx.drawImage(this.canvasImage, 0, 0);

          this.canvasData = this.cx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

          const clickedColor: Pixel = this.getRgbaColorAtCoordonate(event.layerX, event.layerY);
          this.findPixelsAlike(clickedColor);
        }
      });
    }
  }

  initializeArrays(): void {
    this.visitedPoints = new Set<number>();
    this.pointsToKeep = [];
    this.pointsToVisit = [];
    this.borderPoints = [];
    this.innerPoints = [];
  }
}

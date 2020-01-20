import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { FeatherObject } from 'src/app/core/models/shapes/feather-object';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { Point } from 'src/app/core/models/type';
import {
  ALT_SCROLL_JUMP,
  MAX_ANGLE,
  ONE_HUNDRED_EIGHTY_DEGREE,
} from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';
import { SaveDrawingService } from './../../../../components/save-drawing/service/save-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class FeatherHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: FeatherObject;
  featherPreview: ShapeAbs;
  isNewStroke: boolean;
  mouseOnCanvas: boolean;

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.isNewStroke = false;
    this.mouseOnCanvas = false;
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.drawingService.isDrawing) {
      this.createFeatherShape(event);
      this.isNewStroke = true;
      this.drawingService.isDrawing = true;
      this.setRenderer(this.shape.htmlElement, [['opacity', '1']]);

      this.addFeatherPoint(event);
    }
  }

  updateFeatherPreview(event: MouseEvent): void {
    this.featherPreview.origin = {
      x: event.layerX,
      y: event.layerY,
    };

    const ptn = this.calculateXYComponents(
      { x: event.layerX, y: event.layerY },
      this.attributsService.attributs.featherLength,
      this.attributsService.attributs.featherWidth,
      this.attributsService.attributs.angle,
    );

    const points =
      '' +
      event.layerX.toString() +
      ',' +
      event.layerY.toString() +
      ' ' +
      ptn.x.toString() +
      ',' +
      ptn.y.toString();

    this.setRenderer(this.featherPreview.htmlElement, [['points', points]]);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.mouseOnCanvas) {
      this.onEnter();
    } else {
      this.updateFeatherPreview(event);
    }
    if (this.drawingService.isDrawing) {
      this.addFeatherPoint(event);
    }
  }

  addFeatherPoint(event: MouseEvent): void {
    this.shape.addPoint({ x: event.layerX, y: event.layerY });
    if (this.shape.linePoints.length > 2) {
      this.shape.addToRenderer(
        this.attributs.angle,
        this.attributs.featherWidth,
      );
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.isNewStroke = false;
      this.shape.end();
      this.endShape();
    }
  }

  createFeatherShape(event: MouseEvent): void {
    this.shape = new FeatherObject(
      this.shapeDependency,
      this.renderer.createElement('g', 'svg'),
      this.primaryColor,
      { x: event.layerX, y: event.layerY },
      this.attributs.featherWidth,
      this.attributs.featherLength,
    );
    this.shape.render();
    this.setRenderer(this.shape.htmlElement, [['opacity', '1']]);
  }

  onMouseWheel(event: WheelEvent): void {
    if (this.featherPreview) {
      let deltaValue = 0;
      if (event.altKey) {
        deltaValue = Math.sign(event.deltaY);
      } else {
        deltaValue = Math.sign(event.deltaY) * ALT_SCROLL_JUMP;
      }
      if (
        deltaValue < 0 &&
        this.attributsService.attributs.angle + deltaValue < 0
      ) {
        this.attributsService.changeAngle(
          this.attributs.angle + MAX_ANGLE + deltaValue,
        );
      } else if (
        deltaValue > 0 &&
        this.attributsService.attributs.angle + deltaValue > MAX_ANGLE
      ) {
        this.attributsService.changeAngle(
          this.attributs.angle - MAX_ANGLE + deltaValue,
        );
      } else {
        this.attributsService.changeAngle(this.attributs.angle + deltaValue);
      }

      this.updateFeatherPreview(event);
    }
  }

  onEnter(): void {
    this.featherPreview = new ShapeAbs(
      this.shapeDependency,
      this.renderer.createElement('polyline', 'svg'),
      { x: 0, y: 0 },
      {
        x: this.attributsService.attributs.featherLength,
        y: this.attributsService.attributs.featherLength,
      },
      0,
    );
    this.renderer.appendChild(
      this.canvasRef.nativeElement,
      this.featherPreview.htmlElement,
    );
    this.setRenderer(this.featherPreview.htmlElement, [
      ['stroke', this.primaryColor.getHex()],
      ['stroke-width', this.attributsService.attributs.featherWidth.toString()],
    ]);
    this.mouseOnCanvas = true;
  }

  onMouseLeave(): void {
    this.renderer.removeChild(
      this.canvasRef.nativeElement,
      this.featherPreview.htmlElement,
    );
    this.mouseOnCanvas = false;
  }

  reset(): void {
    if (this.drawingService.isDrawing) {
      if (this.shape) {
        this.shape.delete();
      }
      this.drawingService.isDrawing = false;
    }

    if (this.mouseOnCanvas) {
      this.renderer.removeChild(
        this.canvasRef.nativeElement,
        this.featherPreview.htmlElement,
      );
    }
  }

  calculateXYComponents(
    point: Point,
    featherLength: number,
    width: number,
    degreeAngle: number,
  ): Point {
    const angle = -this.degree2radian(degreeAngle);
    const displacement = this.featherPreview.matrixMultiplication(
      [
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)],
      ],
      [[featherLength - width], [0]],
    );
    const xyComponent = {
      x: point.x + displacement[0][0],
      y: point.y + displacement[1][0],
    };

    return xyComponent;
  }

  degree2radian(degree: number): number {
    return degree * (Math.PI / ONE_HUNDRED_EIGHTY_DEGREE);
  }
}

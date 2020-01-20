import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { PenObject } from 'src/app/core/models/shapes/pen-object';
import { Point } from 'src/app/core/models/type';
import {
  DEFAULT_WIDTH,
  FIRST_POINTS,
  LAST_ELEMENT,
  SPEED_COEFFICIENT,
  TWO,
  UPDATE_COEFFICIENT
} from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PenHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: PenObject;
  svgG: SVGGraphicsElement;
  time: number;
  previousWidth: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
  }

  onMouseDown(event: MouseEvent): void | TypeError {
    if (!this.drawingService.isDrawing) {
      this.startingPoint = { x: event.layerX, y: event.layerY };
      this.drawingService.isDrawing = true;
      this.shape = new PenObject(
        this.shapeDependency,
        this.renderer.createElement('g', 'svg'),
        this.primaryColor,
        { x: event.layerX, y: event.layerY },
        this.attributs.width,
      );
      this.shape.render();
    } else {
      throw new Error('Unexpected click while drawing');
    }
    this.previousWidth = DEFAULT_WIDTH;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      const currentTime: number = new Date().getTime();
      let strokeWidth: number =
        (this.attributs.width + this.attributs.minWidth) / 2;

      if (this.shape.linePoints.length >= FIRST_POINTS) {
        const speed: number = this.calculateSpeed(event, currentTime);
        if (speed === 0) {
          strokeWidth = this.previousWidth;
        } else {
          strokeWidth = 1 / speed;
          strokeWidth = this.clamp(strokeWidth);
          strokeWidth = this.smoothLine(strokeWidth);
          strokeWidth = this.clamp(strokeWidth);
          this.previousWidth = strokeWidth;
        }
      }
      this.time = currentTime;

      this.shape.strokeWidths.push(strokeWidth);
      this.addPenStroke(event);
    }
  }

  addPenStroke(event: MouseEvent): void {
    this.shape.addPoint({ x: event.layerX, y: event.layerY });
    this.shape.addToRenderer();
  }

  smoothLine(currentWidth: number): number {
    const deltaWidth: number = currentWidth - this.previousWidth;
    const newWidth: number =
      deltaWidth * UPDATE_COEFFICIENT + this.previousWidth;
    return newWidth;
  }

  clamp(strokeWidth: number): number {
    let min = this.attributs.minWidth;
    let max = this.attributs.width;

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    if (strokeWidth > max) {
      strokeWidth = max;
    } else if (strokeWidth < min) {
      strokeWidth = min;
    }
    return strokeWidth;
  }
  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.shape.end();
      this.setRenderer(this.shape.htmlElement, [
        ['transform', this.shape.transform],
      ]);
      this.endShape();
    }
  }

  calculateSpeed(event: MouseEvent, currentTime: number): number {
    const lastPoint: Point = this.shape.linePoints[
      this.shape.linePoints.length - LAST_ELEMENT
    ];
    const deltaX: number = Math.abs(lastPoint.x - event.layerX);
    const deltaY: number = Math.abs(lastPoint.y - event.layerY);
    const distance: number = Math.sqrt(
      Math.pow(deltaX, TWO) + Math.pow(deltaY, TWO),
    );
    const deltaTime: number = currentTime - this.time;
    const speed: number = (distance / deltaTime) * SPEED_COEFFICIENT;
    return speed;
  }
}

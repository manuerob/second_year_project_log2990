import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { PolygonObject } from 'src/app/core/models/shapes/polygon-object';
import { Point } from 'src/app/core/models/type';
import { LEFT_CLICK } from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PolygonHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: PolygonObject;
  squareRef: SVGGraphicsElement;

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.drawingService.isDrawing) {
      this.startingPoint = { x: event.layerX, y: event.layerY };

      this.drawingService.isDrawing = true;

      this.shape = new PolygonObject(
        this.shapeDependency,
        this.renderer.createElement('polygon', 'svg'),
        this.primaryColor,
        this.secondaryColor,
        { x: this.startingPoint.x, y: this.startingPoint.y },
        { x: 0, y: 0 },
        this.attributs.width,
        this.attributs.plotType,
        this.attributs.sideCount,
      );

      this.shape.render();

      this.squareRef = this.renderer.createElement('rect', 'svg');
      this.setRenderer(this.squareRef, [
        ['x', this.shape.origin.x.toString()],
        ['y', this.shape.origin.y.toString()],
        ['width', this.shape.size.x.toString()],
        ['height', this.shape.size.y.toString()],
        ['fill', 'none'],
        ['stroke', '#4A4A4A'],
        ['stroke-width', '2'],
        ['stroke-dasharray', '10 10'],
      ]);

      this.renderer.appendChild(this.shape.svgG, this.squareRef);
    } else {
      throw new Error('Unexpected click while drawing');
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingService.isDrawing && event.buttons === LEFT_CLICK) {
      const currentPoint: Point = { x: event.layerX, y: event.layerY };
      let xOrigin: number = Math.min(this.startingPoint.x, currentPoint.x);
      let yOrigin: number = Math.min(this.startingPoint.y, currentPoint.y);

      const deltaX: number = Math.abs(currentPoint.x - this.startingPoint.x);
      const deltaY: number = Math.abs(currentPoint.y - this.startingPoint.y);
      const radius: number = Math.max(deltaX, deltaY);

      if (event.layerX < this.startingPoint.x) {
        xOrigin = this.startingPoint.x - radius;
      }
      if (event.layerY < this.startingPoint.y) {
        yOrigin = this.startingPoint.y - radius;
      }
      const origin: Point = {
        x: xOrigin,
        y: yOrigin,
      };
      this.shape.size = { x: radius, y: radius };
      this.shape.origin = origin;
      this.setRenderer(this.shape.htmlElement, [
        ['x', '0'],
        ['y', '0'],
        ['points', this.shape.pointsData],
        ['transform', this.shape.transform],
      ]);
      this.setRenderer(this.squareRef, [
        ['x', this.shape.origin.x.toString()],
        ['y', this.shape.origin.y.toString()],
        ['width', this.shape.size.x.toString()],
        ['height', this.shape.size.y.toString()],
      ]);
    } else if (this.drawingService.isDrawing && event.buttons !== LEFT_CLICK) {
      this.onMouseUp(event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.renderer.removeChild(this.shape.svgG, this.squareRef);
      this.endShape();
    }
  }
}

import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { LineObject } from 'src/app/core/models/shapes/line-object';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';

@Injectable({
  providedIn: 'root',
})
export class LineHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: LineObject;

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    hotkeyManager: HotkeyManagerService,
    savedDrawing: SaveDrawingService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
  }
  onMouseDown(event: MouseEvent): void {
    if (!this.drawingService.isDrawing) {
      this.startingPoint = { x: event.layerX, y: event.layerY };
      this.drawingService.isDrawing = true;

      this.shape = new LineObject(
        this.shapeDependency,
        this.renderer.createElement('path', 'svg'),
        this.primaryColor,
        { x: event.layerX, y: event.layerY },
        this.attributs.width,
        this.attributs.linePattern,
        this.attributs.junctionType,
        this.attributs.pointJointDiameter,
      );

      this.shape.render();
    } else {
      this.shape.move({ x: event.layerX, y: event.layerY });
      this.setRenderer(this.shape.htmlElement, [['d', this.shape.pointsData]]);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.shape.move({ x: event.layerX, y: event.layerY });
      this.setRenderer(this.shape.htmlElement, [['d', this.shape.pointsData]]);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.shape.move({ x: event.layerX, y: event.layerY });
      this.shape.addPoint({ x: event.layerX, y: event.layerY });
      this.setRenderer(this.shape.htmlElement, [['d', this.shape.pointsData]]);
    }
  }

  onShiftDown(isKeyDown: boolean): void {
    this.isShiftDown = isKeyDown;
    if (this.drawingService.isDrawing) {
      this.shape.isClosed = isKeyDown;
      this.shape.updateRender();
    }
  }

  onDoubleClick(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.shape.end();

      this.setRenderer(this.shape.htmlElement, [
        ['d', this.shape.pointsData],
        ['transform', this.shape.transform],
      ]);
      this.endShape();
    }
  }

  onBackspace(): void {
    this.shape.removePoint();
    this.setRenderer(this.shape.htmlElement, [['d', this.shape.pointsData]]);
  }
}

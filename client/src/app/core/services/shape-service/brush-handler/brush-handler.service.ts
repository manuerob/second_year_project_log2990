import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { BrushObject } from 'src/app/core/models/shapes/brush-object';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';

@Injectable({
  providedIn: 'root',
})
export class BrushHandlerService extends ShapeHandlerService implements IShapeHandler {
  shape: BrushObject;

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

      this.shape = new BrushObject(
        this.shapeDependency,
        this.renderer.createElement('polyline', 'svg'),
        this.primaryColor,
        { x: event.layerX, y: event.layerY },
        this.attributs.width,
        this.attributs.texture,
      );

      this.shape.render();
    } else {
      throw new Error('Unexpected click while drawing');
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.shape.addPoint({ x: event.layerX, y: event.layerY });

      this.setRenderer(this.shape.htmlElement, [['points', this.shape.pointsData]]);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.shape.end();

      this.setRenderer(this.shape.htmlElement, [
        ['points', this.shape.pointsData],
        ['transform', this.shape.transform],
      ]);
      this.endShape();
    }
  }
}

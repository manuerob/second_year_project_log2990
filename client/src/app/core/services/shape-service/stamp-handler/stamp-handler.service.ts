import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { StampObject } from 'src/app/core/models/shapes/stamp-object';
import {
  ALT_SCROLL_JUMP,
  DEFAULT_SIZE,
  MAX_ANGLE,
  SCALE_AJUST,
} from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';
import { SaveDrawingService } from './../../../../components/save-drawing/service/save-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class StampHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: StampObject;

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
  }

  onMouseDown(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.setRenderer(this.shape.htmlElement, [['opacity', '1']]);
    }
  }
  onMouseMove(event: MouseEvent): void {
    if (!this.drawingService.isDrawing && this.attributs.stampChoice) {
      this.startingPoint = { x: event.layerX, y: event.layerY };
      this.drawingService.isDrawing = true;

      this.shape = new StampObject(
        this.shapeDependency,
        this.renderer.createElement('image', 'svg'),
        {
          x:
            event.layerX -
            (DEFAULT_SIZE * this.attributs.scaleFactor) / SCALE_AJUST,
          y:
            event.layerY -
            (DEFAULT_SIZE * this.attributs.scaleFactor) / SCALE_AJUST,
        },
        this.attributs.scaleFactor,
        this.attributs.angle,
        this.attributs.stampChoice,
      );
      this.shape.render();
      this.shape.rotate(this.attributs.angle);
      this.setRenderer(this.shape.htmlElement, [['opacity', '.5']]);
    } else if (this.attributs.stampChoice) {
      this.shape.size.x = this.attributs.scaleFactor * DEFAULT_SIZE;
      this.shape.size.y = this.attributs.scaleFactor * DEFAULT_SIZE;

      this.shape.origin = {
        x: event.layerX - this.shape.size.x / SCALE_AJUST,
        y: event.layerY - this.shape.size.y / SCALE_AJUST,
      };
      this.shape.changeStamp(this.attributs.stampChoice);
      this.shape.transformMatrix = [
        [1, 0],
        [0, 1],
      ];
      this.shape.rotate(this.attributs.angle);

      this.setShapeAttributs();
    }
  }
  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.setRenderer(this.shape.htmlElement, [['opacity', '1']]);
      this.endShape();
    }
  }
  onEscPressed(): void {
    throw new Error('Method not implemented.');
  }
  onShiftDown(isKeyDown: boolean): void {
    // currently do nothing
  }

  onMouseWheel(event: WheelEvent): void {
    let deltaValue = 0;
    if (event.altKey) {
      deltaValue = Math.sign(event.deltaY);
    } else {
      deltaValue = Math.sign(event.deltaY) * ALT_SCROLL_JUMP;
    }

    if (deltaValue < 0 && this.attributs.angle + deltaValue < 0) {
      this.attributsService.changeAngle(
        this.attributs.angle + MAX_ANGLE + deltaValue,
      );
    } else if (
      deltaValue > 0 &&
      this.attributs.angle + deltaValue > MAX_ANGLE
    ) {
      this.attributsService.changeAngle(
        this.attributs.angle - MAX_ANGLE + deltaValue,
      );
    } else {
      this.attributsService.changeAngle(this.attributs.angle + deltaValue);
    }

    this.shape.rotate(deltaValue);

    this.setShapeAttributs();
  }

  setShapeAttributs(): void {
    this.setRenderer(this.shape.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['width', this.shape.size.x.toString()],
      ['height', this.shape.size.y.toString()],
      ['transform', this.shape.transform],
      ['opacity', '.5'],
    ]);
    if (this.shape.stampChoice !== undefined) {
      this.setRenderer(this.shape.htmlElement, [
        ['href', this.shape.stampChoice],
      ]);
    }
  }
}

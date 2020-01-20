import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { SpraypaintObject } from 'src/app/core/models/shapes/spraypaint-object';
import { DENSITY, TIMEOUT } from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';
import { SaveDrawingService } from './../../../../components/save-drawing/service/save-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class SpraypaintHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: SpraypaintObject;
  timerId: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.timerId = 0;
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.drawingService.isDrawing) {
      this.startingPoint = { x: event.layerX, y: event.layerY };
      this.drawingService.isDrawing = true;
      this.shape = new SpraypaintObject(
        this.shapeDependency,
        this.renderer.createElement('g', 'svg'),
        this.primaryColor,
        { x: event.layerX, y: event.layerY },
        this.attributs.width,
      );
      this.generateRandomPoints();
      this.shape.render();
    } else {
      throw new Error('Unexpected click while drawing');
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      this.startingPoint = { x: event.layerX, y: event.layerY };
    }
  }

  claculatePoints(): void {
    for (let i = 0; i < DENSITY; i++) {
      const a = Math.random() * 2 * Math.PI;
      // tslint:disable: no-bitwise
      const distanceFromRadius = Math.sqrt(~~(Math.random() * this.attributs.width * this.attributs.width));
      const radius = Math.sqrt(~~(Math.random() * this.attributs.width * this.attributs.width) % DENSITY);
      const x = this.startingPoint.x + distanceFromRadius * Math.cos(a);
      const y = this.startingPoint.y + distanceFromRadius * Math.sin(a);
      const point = { x, y };
      this.shape.addPoint(point);
      this.shape.linePointRadiuses.push(radius);
      this.drawCircle(x, y, radius);
    }
  }

  generateRandomPoints(): void {
    this.claculatePoints();
    this.timerId = window.setInterval(() => {
      this.claculatePoints();
    }, TIMEOUT / this.attributsService.attributs.emissionRate);
  }

  drawCircle(x: number, y: number, radius: number): void {
    const paint = this.renderer.createElement('circle', 'svg');
    this.shape.setRenderer(paint, [
      ['cx', x.toString()],
      ['cy', y.toString()],
      ['r', radius.toString()],
      ['stroke', 'none'],
    ]);
    this.shape.paintScatters.push(paint);
    this.renderer.appendChild(this.shape.htmlElement, paint);
    this.shape.addToRenderer();
  }

  endShape(): void {
    this.shape.end();
    super.endShape();
  }

  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      window.clearInterval(this.timerId);
      this.timerId = 0;
      this.drawingService.isDrawing = false;
      this.endShape();
    }
  }
}

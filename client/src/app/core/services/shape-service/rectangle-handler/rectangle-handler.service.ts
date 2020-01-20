import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { RectangleObject } from 'src/app/core/models/shapes/rectangle-object';
import { LEFT_CLICK } from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from './../shape-handler/shape-handler.service';

export class RectangleHandlerService extends ShapeHandlerService implements IShapeHandler {
  shape: RectangleObject;

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

      this.shape = new RectangleObject(
        this.shapeDependency,
        this.renderer.createElement('rect', 'svg'),
        this.primaryColor,
        this.secondaryColor,
        { x: event.layerX, y: event.layerY },
        { x: 0, y: 0 },
        this.attributs.width,
        this.attributs.plotType,
      );

      this.shape.render();
    } else {
      throw new Error('Unexpected drawing try while drawing');
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.drawingService.isDrawing && event.buttons === LEFT_CLICK) {
      let xOrigin: number = Math.min(this.startingPoint.x, event.layerX);
      let yOrigin: number = Math.min(this.startingPoint.y, event.layerY);

      let xSize: number = Math.abs(this.startingPoint.x - event.layerX);
      let ySize: number = Math.abs(this.startingPoint.y - event.layerY);

      if (this.isShiftDown) {
        xSize = Math.max(xSize, ySize);
        ySize = xSize;
        if (event.layerX < this.startingPoint.x) {
          xOrigin = this.startingPoint.x - xSize;
        }
        if (event.layerY < this.startingPoint.y) {
          yOrigin = this.startingPoint.y - ySize;
        }
      }
      this.shape.size = {
        x: xSize,
        y: ySize,
      };
      this.shape.origin = {
        x: xOrigin,
        y: yOrigin,
      };

      this.setRenderer(this.shape.htmlElement, [
        ['x', '0'],
        ['y', '0'],
        ['width', this.shape.size.x.toString()],
        ['height', this.shape.size.y.toString()],
        ['transform', this.shape.transform],
      ]);
    } else if (this.drawingService.isDrawing && event.buttons !== LEFT_CLICK) {
      this.onMouseUp(event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.drawingService.isDrawing) {
      if (this.shape.size.x + this.shape.size.y) {
        this.endShape();
      } else {
        this.shape.delete();
      }
      this.drawingService.isDrawing = false;
    }
  }
}

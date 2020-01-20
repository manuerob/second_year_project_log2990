import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { ShapeComposite } from 'src/app/core/models/shapes/shape-composite';
import { ShapeHandlerService } from 'src/app/core/services/shape-service/shape-handler/shape-handler.service';
import { LEFT_CLICK } from '../../../../../../../common/constants/constants';
import { DeleteCommand } from '../../command-manager/commands/delete-command';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';

@Injectable({
  providedIn: 'root',
})
export class EraseHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: ShapeComposite;
  isErasing: boolean;
  leftClick: boolean;
  isDrawn: boolean;
  mouseOnCanvas: boolean;
  asMoved: boolean;

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.leftClick = false;
    this.isErasing = false;
    this.asMoved = false;
    this.mouseOnCanvas = false;
  }

  moveEraseRectangle(event: MouseEvent): void {
    this.shape.origin = {
      x: event.layerX - this.shape.size.x / 2,
      y: event.layerY - this.shape.size.y / 2,
    };

    this.shape.size.x = this.attributs.eraseSize;
    this.shape.size.y = this.attributs.eraseSize;
    this.setRenderer(this.shape.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['width', this.shape.size.x.toString()],
      ['height', this.shape.size.y.toString()],
      ['fill', 'none'],
      ['style', 'pointer-events: none'],
      ['stroke', 'black'],
      ['stroke-width', '2'],
      ['transform', this.shape.transform],
    ]);
  }

  onMouseUp(event: MouseEvent): void {
    this.drawingService.isDrawing = false;
    if (this.shape.shapes.length) {
      const command: DeleteCommand = new DeleteCommand(this.shape);
      this.commandManager.addCommand(command);
      this.shape = new ShapeComposite(
        this.shapeDependency,
        this.shape.htmlElement,
        { x: 0, y: 0 },
        {
          x: this.attributs.eraseSize,
          y: this.attributs.eraseSize,
        },
      );
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.mouseOnCanvas) {
      this.onEnter();
    } else {
      this.moveEraseRectangle(event);
    }
    if (this.drawingService.isDrawing && event.buttons === LEFT_CLICK) {
      this.svgsService.svgs.forEach(
        (shape: ShapeAbs, key: SVGGraphicsElement) => {
          if (shape.collid(this.shape)) {
            this.shape.shapes.push(shape);
            shape.delete();
          }
        },
      );
    } else if (this.drawingService.isDrawing) {
      this.onMouseUp(event);
    }
  }

  onEnter(): void {
    this.shape = new ShapeComposite(
      this.shapeDependency,
      this.renderer.createElement('rect', 'svg'),
      { x: 0, y: 0 },
      {
        x: this.attributs.eraseSize,
        y: this.attributs.eraseSize,
      },
    );
    this.renderer.appendChild(
      this.canvasRef.nativeElement,
      this.shape.htmlElement,
    );
    this.setRenderer(this.shape.htmlElement, [
      ['x', (-this.shape.size.x / 2).toString()],
      ['y', (-this.shape.size.y / 2).toString()],
      ['width', this.shape.size.x.toString()],
      ['height', this.shape.size.y.toString()],
      ['fill', 'none'],
      ['stroke', 'black'],
      ['stroke-width', '2'],
      ['transform', this.shape.transform],
    ]);
    this.mouseOnCanvas = true;
  }

  onMouseLeave(): void {
    this.renderer.removeChild(
      this.canvasRef.nativeElement,
      this.shape.htmlElement,
    );
    this.mouseOnCanvas = false;
  }

  collision(): void {
    this.svgsService.svgs.forEach(
      (shape: ShapeAbs, key: SVGGraphicsElement) => {
        if (this.leftClick) {
          if (shape.collid(this.shape)) {
            this.shape.shapes.push(shape);
          }
        }
      },
    );
  }

  onMouseDown(event: MouseEvent): void {
    this.leftClick = event.buttons === LEFT_CLICK ? true : false;
    this.drawingService.isDrawing = true;
    this.svgsService.svgs.forEach(
      (shape: ShapeAbs, key: SVGGraphicsElement) => {
        if (shape.selected) {
          shape.delete();
          this.shape.shapes.push(shape);
          shape.selected = false;
        }
      },
    );
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
        this.shape.htmlElement,
      );
    }
  }
}

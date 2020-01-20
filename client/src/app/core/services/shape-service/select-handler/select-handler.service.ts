import { Injectable } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { SelectObject } from 'src/app/core/models/shapes/select-object';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import {
  ALT_SCROLL_JUMP,
  LEFT_CLICK,
  MIN_COORDONATE,
  RIGHT_BUTTON,
} from '../../../../../../../common/constants/constants';
import { ShapeComposite } from '../../../models/shapes/shape-composite';
import { CreateCommand } from '../../command-manager/commands/create-command';
import { DeleteCommand } from '../../command-manager/commands/delete-command';
import { ResizeCommand } from '../../command-manager/commands/resize-command';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { Point } from './../../../models/type';
import { ClipboardService } from './../../clipboard-service/clipboard.service';
import { SnapCommand } from './../../command-manager/commands/snap-command';
import { ShapeHandlerService } from './../shape-handler/shape-handler.service';
import { ResizeService } from './resize/resize.service';
import { SnappingService } from './snapping/snapping.service';

/* tslint:disable:no-magic-numbers */

@Injectable({
  providedIn: 'root',
})
export class SelectHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: SelectObject;
  isDrawn: boolean;
  dragging: boolean;
  maxPointPosition: Point;
  rightClick: boolean;
  selectionSquareRef: SVGGraphicsElement;
  copiedShapes: ShapeComposite;
  deltaCopy: Point;
  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
    private clipboardService: ClipboardService,
    private dragService: SnappingService,
    private resizeService: ResizeService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.maxPointPosition = { x: 5000, y: 5000 };
    this.rightClick = false;
    this.deltaCopy = { x: 30, y: 30 };
    this.subscriptions.push(
      clipboardService.shapeComposite$.subscribe((shapes: ShapeComposite) => {
        this.copiedShapes = shapes;
      }),
    );
  }

  onMouseDown(event: MouseEvent): void {
    this.rightClick = event.button === RIGHT_BUTTON ? true : false;
    if (this.shape && this.shape.dragging) {
      this.startingPoint = this.shape.origin;
    } else {
      this.drawNewRectangle(event);
    }
    this.dragService.deltaStart = { x: event.layerX, y: event.layerY };
  }

  dragSelectedShapes(event: MouseEvent): void {
    this.dragService.dragSelectedShapes(event, this.shape);
  }

  drawNewRectangle(event: MouseEvent): void {
    if (this.shape && this.shape.isDrawn) {
      this.removeSquare();
    }
    if (!this.drawingService.isDrawing) {
      this.startingPoint = { x: event.layerX, y: event.layerY };
      this.drawingService.isDrawing = true;
      this.selectionSquareRef = this.renderer.createElement('rect', 'svg');
      this.shape = new SelectObject(
        this.shapeDependency,
        this.selectionSquareRef,
        { x: event.layerX - 10, y: event.layerY - 10 },
        { x: 20, y: 20 },
      );

      this.shape.renderRectangle();
      this.setRenderer(this.shape.htmlElement, [
        ['stroke-opacity', '0'],
        ['fill-opacity', '0'],
      ]);
      this.shape.setListener();
      this.renderer.appendChild(this.shape.svgG, this.shape.htmlElement);
      this.renderer.appendChild(this.canvasRef.nativeElement, this.shape.svgG);
    } else {
      throw new Error('Unexpected drawing try while drawing');
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.resizeService.isActive) {
      this.resizeService.onMovement(event);
    } else if (this.shape && this.shape.dragging) {
      this.dragSelectedShapes(event);
    } else {
      this.expandSelectRectangle(event);
    }
  }

  expandSelectRectangle(event: MouseEvent): void {
    if (this.drawingService.isDrawing && event.buttons === LEFT_CLICK) {
      const xOrigin: number = Math.min(this.startingPoint.x, event.layerX);
      const yOrigin: number = Math.min(this.startingPoint.y, event.layerY);

      const xSize: number = Math.abs(this.startingPoint.x - event.layerX);
      const ySize: number = Math.abs(this.startingPoint.y - event.layerY);

      this.shape.size = {
        x: xSize,
        y: ySize,
      };

      this.shape.origin = {
        x: xOrigin,
        y: yOrigin,
      };
      this.shape.renderRectangle();
    } else if (this.drawingService.isDrawing) {
      this.onMouseUp(event);
    }
  }

  collision(): void {
    this.svgsService.svgs.forEach((shape: ShapeAbs) => {
      if (this.rightClick) {
        if (!shape.collid(this.shape)) {
          this.shape.shapes.push(shape);
        }
      } else {
        if (shape.collid(this.shape)) {
          this.shape.shapes.push(shape);
        }
      }
    });
    if (this.shape.shapes.length) {
      this.shape.updateRectangle();
    }
  }

  onCopy(): void {
    if (this.shape.isDrawn) {
      this.clipboardService.shapeComposite = this.shape;
      this.clipboardService.clipOrigin = this.shape.origin;
    }
  }

  onCut(): void {
    if (this.shape.isDrawn) {
      this.clipboardService.shapeComposite = this.shape;
      this.clipboardService.clipOrigin = this.shape.origin;
      this.shape.delete();
      const command: DeleteCommand = new DeleteCommand(this.shape);
      this.commandManager.addCommand(command);
      this.removeSquare();
    }
  }

  onDuplicate(): void {
    if (this.shape.isDrawn) {
      this.onCopy();
      this.onPaste();
    }
  }

  onBackspace(): void {
    if (this.shape) {
      this.shape.delete();
      const command: DeleteCommand = new DeleteCommand(this.shape);
      this.commandManager.addCommand(command);
      this.removeSquare();
    }
  }

  onPaste(): void {
    if (!this.clipboardService.isClipboardEmpty) {
      this.copiedShapes.moveShape(this.deltaCopy);
      if (this.shape.isDrawn) {
        this.removeSquare();
      }
      this.shape = new SelectObject(
        this.shapeDependency,
        this.selectionSquareRef,
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      );
      this.shape.renderRectangle();
      this.shape.setListener();
      this.renderer.appendChild(this.shape.svgG, this.shape.htmlElement);
      this.renderer.appendChild(this.canvasRef.nativeElement, this.shape.svgG);
      this.shape.shapes = this.copiedShapes.shapes;
      this.shape.updateRectangle();
      if (
        this.shape.origin.x > this.drawingService.width ||
        this.shape.origin.y > this.drawingService.height
      ) {
        this.copiedShapes.moveShape({
          x: this.clipboardService.clipOrigin.x - this.shape.origin.x,
          y: this.clipboardService.clipOrigin.y - this.shape.origin.y,
        });
        this.shape.updateRectangle();
      }
      this.shape.render();
      this.renderer.appendChild(this.canvasRef.nativeElement, this.shape.svgG);
      this.shape.createCircle();
      const command: CreateCommand = new CreateCommand(this.shape);
      this.commandManager.addCommand(command);
      this.clipboardService.reset();
    }
  }

  onSelectAll(): void {
    if (this.shape.isDrawn) {
      this.removeSquare();
    }
    this.selectionSquareRef = this.renderer.createElement('rect', 'svg');
    this.shape = new SelectObject(
      this.shapeDependency,
      this.selectionSquareRef,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    );
    this.shape.renderRectangle();
    this.shape.setListener();
    this.renderer.appendChild(this.shape.svgG, this.shape.htmlElement);
    this.renderer.appendChild(this.canvasRef.nativeElement, this.shape.svgG);
    this.svgsService.svgs.forEach((shape: ShapeAbs) => {
      this.shape.shapes.push(shape);
    });
    this.shape.updateRectangle();
    this.shape.createCircle();
  }

  onMouseUp(event: MouseEvent): void {
    if (this.resizeService.isActive) {
      this.resizeService.endMovement();
      this.commandManager.addCommand(
        new ResizeCommand(
          this.shape,
          this.resizeService.temporaryTransformation,
          this.resizeService.temporaryDisplacement,
        ),
      );
    } else if (this.drawingService.isDrawing) {
      this.drawingService.isDrawing = false;
      this.collision();
      if (!this.shape.shapes.length) {
        this.renderer
          .parentNode(this.shape.htmlElement)
          .removeChild(this.selectionSquareRef);
      } else {
        this.shape.createCircle();
        this.shape.isDrawn = true;
      }
    }
    if (this.shape.dragging) {
      this.shape.dragging = false;
      this.commandManager.addCommand(
        new SnapCommand(this.shape, {
          x: this.shape.origin.x - this.startingPoint.x,
          y: this.shape.origin.y - this.startingPoint.y,
        }),
      );
    }
  }

  onMouseWheel(event: WheelEvent): void {
    if (this.shape && this.shape.isDrawn && !this.resizeService.isActive) {
      let deltaValue = 0;
      if (event.altKey) {
        deltaValue = Math.sign(event.deltaY);
      } else {
        deltaValue = Math.sign(event.deltaY) * ALT_SCROLL_JUMP;
      }
      this.shape.rotationEvent(deltaValue, event.shiftKey);
    }
  }

  reset(): void {
    if (this.shape && this.shape.isDrawn) {
      this.removeSquare();
      this.drawingService.isDrawing = false;
      this.shape.isDrawn = false;
    }
  }

  removeSquare(): void {
    this.renderer.removeChild(this.canvasRef.nativeElement, this.shape.svgG);
    this.shape = new SelectObject(
      this.shapeDependency,
      this.selectionSquareRef,
      { x: MIN_COORDONATE, y: MIN_COORDONATE },
      { x: MIN_COORDONATE, y: MIN_COORDONATE },
    );
    this.shape.isDrawn = false;
  }
}

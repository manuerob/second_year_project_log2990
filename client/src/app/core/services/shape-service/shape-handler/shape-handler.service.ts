import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from 'src/app/core/models/attributs';
import { Color } from 'src/app/core/models/color';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { Tool } from 'src/app/core/models/tool';
import { Point } from 'src/app/core/models/type';
import { ColorService } from '../../color/color.service';
import { CreateCommand } from '../../command-manager/commands/create-command';
import { DrawingService } from '../../drawing/drawing.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { SaveDrawingService } from './../../../../components/save-drawing/service/save-drawing.service';
import { ToolService } from './../../../../components/toolbar/service/tool.service';
import { CommandManagerService } from './../../command-manager/command-manager.service';
import { HotkeyManagerService } from './../../hotkey/hotkey-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ShapeHandlerService extends AbstractSubscriptions
  implements IShapeHandler {
  shape: ShapeAbs;
  isShiftDown: boolean;
  attributs: Attributs;
  primaryColor: Color;
  secondaryColor: Color;
  startingPoint: Point;
  canvasRef: ElementRef;
  activeToolTitle: string;
  minMovement: number;
  renderer: Renderer2;
  svgsService: DisplayShapesService;
  drawingService: DrawingService;
  toolService: ToolService;
  commandManager: CommandManagerService;
  colorService: ColorService;

  constructor(
    protected shapeDependency: ShapeDependencyService,
    protected attributsService: AttributsService,
    protected savedDrawing: SaveDrawingService,
    protected hotkeyManager: HotkeyManagerService,
  ) {
    super();
    this.renderer = shapeDependency.renderer;
    this.svgsService = shapeDependency.svgsService;
    this.drawingService = shapeDependency.drawingService;
    this.toolService = shapeDependency.toolService;
    this.commandManager = shapeDependency.commandManager;
    this.colorService = shapeDependency.colorService;
    this.subscriptions = [];

    this.subscriptions.push(
      this.colorService.primaryColor$.subscribe((primaryColor: Color) => {
        this.primaryColor = primaryColor;
      }),
    );
    this.subscriptions.push(
      this.colorService.secondaryColor$.subscribe((secondaryColor: Color) => {
        this.secondaryColor = secondaryColor;
      }),
    );

    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.attributs = attributs;
      }),
    );
    this.subscriptions.push(
      this.drawingService.canvasRef$.subscribe((canvasRef: ElementRef) => {
        this.canvasRef = canvasRef;
      }),
    );
    this.subscriptions.push(
      this.toolService.activeTool$.subscribe((tool: Tool): void => {
        this.activeToolTitle = tool.title;
      }),
    );
  }

  endShape(): void {
    this.commandManager.addCommand(new CreateCommand(this.shape));
    this.savedDrawing.updateSavedImage();
  }

  onShiftDown(isKeyDown: boolean): void {
    this.isShiftDown = isKeyDown;
  }

  onEscPressed(): void {
    if (this.drawingService.isDrawing) {
      const parent: SVGGraphicsElement = this.renderer.parentNode(
        this.shape.htmlElement,
      );
      this.renderer.parentNode(parent).removeChild(parent);
      this.drawingService.isDrawing = false;
    }
  }
  onMouseDown(event: MouseEvent): void {
    // fallthrough
  }
  onMouseMove(event: MouseEvent): void {
    // fallthrough
  }
  onMouseUp(event: MouseEvent): void {
    // fallthrough
  }
  reset(): void {
    if (this.drawingService.isDrawing) {
      if (this.shape) {
        this.shape.delete();
      }
      this.drawingService.isDrawing = false;
    }
  }

  setRenderer(
    htmlElement: SVGGraphicsElement,
    setter: [string, string][],
  ): void {
    setter.forEach(([key, value]: [string, string]): void => {
      this.renderer.setAttribute(htmlElement, key, value);
    });
  }
}

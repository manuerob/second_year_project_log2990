import { ElementRef, Renderer2 } from '@angular/core';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { AbstractSubscriptions } from '../../helper/class/abstract-subscriptions';
import { ColorService } from '../../services/color/color.service';
import { CommandManagerService } from '../../services/command-manager/command-manager.service';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { ToolAbs } from '../tool-abs';

export class ShapeSubscription extends AbstractSubscriptions {
  primaryColor: Color;
  secondaryColor: Color;
  canvasRef: ElementRef;
  activeToolTitle: string;

  renderer: Renderer2;
  svgsService: DisplayShapesService;
  drawingService: DrawingService;
  toolService: ToolService;
  commandManager: CommandManagerService;
  colorService: ColorService;

  constructor(protected shapeDependency: ShapeDependencyService) {
    super();
    this.renderer = shapeDependency.renderer;
    this.svgsService = shapeDependency.svgsService;
    this.drawingService = shapeDependency.drawingService;
    this.toolService = shapeDependency.toolService;
    this.commandManager = shapeDependency.commandManager;
    this.colorService = shapeDependency.colorService;

    this.subscriptions.push(
      this.drawingService.canvasRef$.subscribe((canvasRef: ElementRef) => {
        this.canvasRef = canvasRef;
      }),
    );
    this.subscriptions.push(
      this.toolService.activeTool$.subscribe((activeTool: ToolAbs) => {
        this.activeToolTitle = activeTool.title;
      }),
    );

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
  }
}

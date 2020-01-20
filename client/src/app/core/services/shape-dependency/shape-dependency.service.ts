import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { ToolService } from '../../../components/toolbar/service/tool.service';
import { ColorService } from '../../services/color/color.service';
import { CommandManagerService } from '../../services/command-manager/command-manager.service';
import { ResizeService } from './../shape-service/select-handler/resize/resize.service';

@Injectable({
  providedIn: 'root',
})
export class ShapeDependencyService {
  renderer: Renderer2;
  constructor(
    public drawingService: DrawingService,
    rendererFactory: RendererFactory2,
    public toolService: ToolService,
    public commandManager: CommandManagerService,
    public svgsService: DisplayShapesService,
    public colorService: ColorService,
    public resizeService: ResizeService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
}

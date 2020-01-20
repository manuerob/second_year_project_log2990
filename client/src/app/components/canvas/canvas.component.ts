import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Injector,
  OnChanges,
  OnInit,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Color } from 'src/app/core/models/color';
import { Graph } from 'src/app/core/models/graph';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { EllipseHandlerService } from 'src/app/core/services/shape-service/ellipse-handler/ellipse-handler.service';
import { EraseHandlerService } from 'src/app/core/services/shape-service/erase-handler/erase-handler.service';
import { LineHandlerService } from 'src/app/core/services/shape-service/line-handler/line-handler.service';
import { PenHandlerService } from 'src/app/core/services/shape-service/pen-handler/pen-handler.service';
import { PipetteHandlerService } from 'src/app/core/services/shape-service/pipette-handler/pipette-handler.service';
import { PolygonHandlerService } from 'src/app/core/services/shape-service/polygon-handler/polygon-handler.service';
import { ShapeHandlerService } from 'src/app/core/services/shape-service/shape-handler/shape-handler.service';
import { StampHandlerService } from 'src/app/core/services/shape-service/stamp-handler/stamp-handler.service';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_HEIGHT_MARGIN,
  DEFAULT_WIDTH_MARGIN,
} from './../../../../../common/constants/constants';
import { Tool } from './../../core/models/tool';
import { BrushHandlerService } from './../../core/services/shape-service/brush-handler/brush-handler.service';
import { PencilHandlerService } from './../../core/services/shape-service/pencil-handler/pencil-handler.service';
import { RectangleHandlerService } from './../../core/services/shape-service/rectangle-handler/rectangle-handler.service';
import { ToolService } from './../toolbar/service/tool.service';
import { GridService } from './grid/grid.service';

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  providers: [
    RectangleHandlerService,
    PencilHandlerService,
    PenHandlerService,
    BrushHandlerService,
    EllipseHandlerService,
    StampHandlerService,
    LineHandlerService,
    PolygonHandlerService,
    ShapeHandlerService,
    PipetteHandlerService,
    EraseHandlerService,
  ],
})
export class CanvasComponent extends AbstractSubscriptions
  implements OnInit, AfterViewInit, OnChanges {
  canvasWidth: number;
  canvasHeight: number;
  canvasColor: string;
  command: string;
  originalPosition: Coordinates;
  distance: Coordinates;
  svgs: ShapeAbs[];
  data: string;
  showGrid: boolean;
  currentHandler: IShapeHandler;
  renderer: Renderer2;

  @ViewChild('canvasWorkZone', { static: true }) workZone: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  @HostListener('window:resize')
  onResize(): void {
    this.drawingService.updateSize(
      this.workZone.nativeElement.offsetWidth,
      this.workZone.nativeElement.offsetHeight,
    );
  }

  constructor(
    rendererFactory: RendererFactory2,
    public drawingService: DrawingService,
    private gridService: GridService,
    private toolService: ToolService,
    private injector: Injector,
    private svgsService: DisplayShapesService,
    private api: ApiService,
  ) {
    super();
    this.renderer = rendererFactory.createRenderer(null, null);
    this.svgs = [];
    this.command = 'create';
    this.distance = { x: 0, y: 0 };
    this.originalPosition = { x: 0, y: 0 };
    this.canvasColor = DEFAULT_BACKGROUND_COLOR;
    this.toolService.activeTool$.subscribe((tool: Tool) => {
      if (this.currentHandler) {
        this.currentHandler.reset();
      }
      this.currentHandler = this.injector.get(tool.service);
    });
    this.api.graph$.subscribe((graph: Graph) => {
      if (this.canvas) {
        this.canvasWidth = graph.width;
        this.canvasHeight = graph.height;
        this.canvasColor = graph.backgroundColor;
        this.svgsService.emptySvgs();
        this.resetCanvas();
      }
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.drawingService.height$.subscribe((dimension: number) => {
        this.canvasHeight = dimension;
      }),
    );
    this.subscriptions.push(
      this.drawingService.width$.subscribe((dimension: number) => {
        this.canvasWidth = dimension;
      }),
    );

    this.subscriptions.push(
      this.drawingService.canvasColor$.subscribe((color: Color) => {
        this.canvasColor = color.getColorString();
      }),
    );

    this.subscriptions.push(
      this.gridService.showGrid$.subscribe((showGrid: boolean) => {
        this.showGrid = showGrid;
      }),
    );
  }

  resetCanvas(): void {
    const childElements = this.canvas.nativeElement.childNodes;
    while (childElements.length > 1) {
      this.canvas.nativeElement.removeChild(this.canvas.nativeElement.lastChild);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateCanvas();
    }, 1);
  }

  ngOnChanges(): void {
    this.updateCanvas();
  }

  updateCanvas(): void {
    this.canvasWidth = this.api.graph.width - DEFAULT_WIDTH_MARGIN;
    this.canvasHeight = this.api.graph.height - DEFAULT_HEIGHT_MARGIN;
    this.canvasColor = this.api.graph.backgroundColor;
    this.drawingService.canvasRef = this.canvas;
  }

  onMouseDown(event: MouseEvent): void {
    this.currentHandler.onMouseDown(event);
  }
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent): void {
    this.currentHandler.onMouseUp(event);
  }

  onMouseMove(event: MouseEvent): void {
    this.currentHandler.onMouseMove(event);
  }

  onMouseWheel(event: WheelEvent): void {
    if (this.currentHandler.onMouseWheel) {
      this.currentHandler.onMouseWheel(event);
    }
  }

  onMouseEnter(event: MouseEvent): void {
    if (this.currentHandler.onMouseEnter) {
      this.currentHandler.onMouseEnter(event);
    }
  }

  onMouseLeave(event: MouseEvent): void {
    if (this.currentHandler.onMouseLeave) {
      this.currentHandler.onMouseLeave(event);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydownHandler(): void {
    if (this.currentHandler.onEscPressed) {
      this.currentHandler.onEscPressed();
    }
  }

  onDoubleClickHandler(event: MouseEvent): void {
    if (this.currentHandler.onDoubleClick) {
      this.currentHandler.onDoubleClick(event);
    }
  }

  onClickHandler(event: MouseEvent): void {
    if (this.currentHandler.onClick) {
      this.currentHandler.onClick(event);
    }
  }

  @HostListener('document:keydown.shift', ['$event'])
  onShiftKeydownHandler(event: KeyboardEvent): void {
    this.currentHandler.onShiftDown(event.returnValue);
  }

  @HostListener('document:keydown.backspace')
  onBackspaceHandler(): void {
    if (this.currentHandler.onBackspace) {
      this.currentHandler.onBackspace();
    }
  }

  @HostListener('document:keydown.control.c')
  onCopyHandler(): void {
    if (this.currentHandler.onCopy) {
      this.currentHandler.onCopy();
    }
  }

  @HostListener('document:keydown.control.v')
  onPasteHandler(): void {
    if (this.currentHandler.onPaste) {
      this.currentHandler.onPaste();
    }
  }

  @HostListener('document:keydown.control.d', ['$event'])
  onDuplicateHandler(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.currentHandler.onDuplicate) {
      this.currentHandler.onDuplicate();
    }
  }

  @HostListener('document:keydown.control.a', ['$event'])
  onSelectAllHandler(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.currentHandler.onSelectAll) {
      this.currentHandler.onSelectAll();
    }
  }

  @HostListener('document:keydown.control.x', ['$event'])
  onCutHandler(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.currentHandler.onCut) {
      this.currentHandler.onCut();
    }
  }

  @HostListener('document:keyup.shift', ['$event'])
  onShiftKeyUpHandler(event: KeyboardEvent): void {
    this.currentHandler.onShiftDown(!event.returnValue);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    if (this.currentHandler.onKeyDown) {
      this.currentHandler.onKeyDown(event);
    }
  }
}

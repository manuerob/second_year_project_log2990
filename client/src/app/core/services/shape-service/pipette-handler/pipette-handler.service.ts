import { Injectable, OnInit } from '@angular/core';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { Color } from 'src/app/core/models/color';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { Point } from 'src/app/core/models/type';
import { LEFT_CLICK_BUTTON, RIGHT_CLICK_BUTTON } from '../../../../../../../common/constants/constants';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from '../shape-handler/shape-handler.service';

@Injectable({
  providedIn: 'root',
})
export class PipetteHandlerService extends ShapeHandlerService implements IShapeHandler, OnInit {
  private canvasImage: CanvasImageSource;
  private cx: CanvasRenderingContext2D | null;
  private tempCanvas: HTMLCanvasElement;
  private canvasWidth: number;
  private canvasHeight: number;
  private isPipetteActive: boolean;

  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.drawingService.width$.subscribe((width: number) => {
      this.canvasWidth = width;
    });
    this.drawingService.height$.subscribe((height: number) => {
      this.canvasHeight = height;
    });
    this.isPipetteActive = false;
    this.toolService.activeTool$.subscribe((tool) => {
      if (tool.title !== 'Pipette' && this.canvasRef.nativeElement.style.display === 'none') {
        this.isPipetteActive = false;
        const parent = this.renderer.parentNode(this.canvasRef.nativeElement);
        this.renderer.removeStyle(this.canvasRef.nativeElement, 'display');
        this.renderer.removeChild(parent, parent.querySelector('canvas'));
      }
      if (tool.title === 'Pipette') {
        this.initCanvas();
        this.isPipetteActive = true;
      }
    });
  }

  initCanvas(): void {
    if (!this.isPipetteActive) {
      this.tempCanvas = this.renderer.createElement('canvas');
      this.tempCanvas.width = this.canvasWidth;
      this.tempCanvas.height = this.canvasHeight;

      this.canvasImage = new Image();
      this.canvasImage.height = this.canvasHeight;
      this.canvasImage.width = this.canvasWidth;

      this.renderer.setAttribute(this.tempCanvas, 'width', this.canvasWidth.toString());
      this.renderer.setAttribute(this.tempCanvas, 'height', this.canvasHeight.toString());
      const parent = this.renderer.parentNode(this.canvasRef.nativeElement);
      this.renderer.insertBefore(parent, this.tempCanvas as HTMLElement, this.canvasRef.nativeElement);
      this.ngOnInit();
      this.extractImage();
      this.renderer.setStyle(this.canvasRef.nativeElement, 'display', 'none');
    }
  }

  ngOnInit(): void {
    this.cx = this.tempCanvas.getContext('2d');
  }

  onMouseDown(mouseEvent: MouseEvent): void {
    let x;
    let y;
    const parentFirst = this.renderer.parentNode(this.tempCanvas);
    const parentSecond = this.renderer.parentNode(parentFirst);
    const mousePosition = this.findMousePosition(this.tempCanvas);
    if (mousePosition) {
      x = mouseEvent.pageX - mousePosition.x + parentSecond.scrollLeft;
      y = mouseEvent.pageY - mousePosition.y + parentSecond.scrollTop;
    }
    this.cx = this.tempCanvas.getContext('2d');
    let pixelData;
    if (this.cx) {
      pixelData = this.cx.getImageData(x || 0, y || 0, 1, 1).data;
    }
    let clickedColor: Color;
    clickedColor = new Color();
    if (pixelData) {
      clickedColor.r = pixelData[0];
      clickedColor.g = pixelData[1];
      // tslint:disable-next-line: no-magic-numbers
      clickedColor.b = pixelData[2];
      // tslint:disable-next-line: no-magic-numbers
      clickedColor.a = pixelData[3];
    }
    if (mouseEvent.button === LEFT_CLICK_BUTTON) {
      this.colorService.primaryColorHex = clickedColor.rgb2hex();
    } else if (mouseEvent.button === RIGHT_CLICK_BUTTON) {
      this.colorService.secondaryColorHex = clickedColor.rgb2hex();
    }
  }

  private extractImage(): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.cx = this.tempCanvas.getContext('2d');
      if (this.cx) {
        const svgXml: string = new XMLSerializer().serializeToString(this.canvasRef.nativeElement);
        const svgBase64: string = btoa(svgXml);
        const headerBase64 = 'data:image/svg+xml;base64,';
        const fullImageBase64: string = headerBase64 + svgBase64;
        (this.canvasImage as HTMLImageElement).src = fullImageBase64;
        (this.canvasImage as HTMLImageElement)
          .decode()
          .then(() => {
            if (this.cx) {
              this.cx.drawImage(this.canvasImage, 0, 0);
              resolve();
            }
          })
          .catch((error: Error) => {
            throw error;
          });
      }
    });

  }

  private findMousePosition(htmlElement: HTMLElement): Point | undefined {
    let curleft = 0;
    let curtop = 0;
    if (htmlElement.offsetParent) {
      while (htmlElement) {
        curleft += htmlElement.offsetLeft;
        curtop += htmlElement.offsetTop;
        htmlElement = htmlElement.offsetParent as HTMLElement;
      }
      return { x: curleft, y: curtop };
    }
    return;
  }
}

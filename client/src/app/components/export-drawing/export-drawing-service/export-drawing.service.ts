import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Graph } from 'src/app/core/models/graph';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { DisplayShapesService } from '../../attributs/display-shapes/service/display-shapes.service';
import { CanvasToBMP } from '../canvasToBMP';
import { ApiService } from './../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ExportDrawingService extends AbstractSubscriptions {
  canvasImage: CanvasImageSource;
  ctx: CanvasRenderingContext2D | null;
  myCanvas: HTMLCanvasElement;
  canvasRef: ElementRef;
  uri: string;
  fileType: string;
  renderer: Renderer2;
  svg: SVGElement | null;
  drawing: Graph;
  currentGraphExported: boolean;
  service: SVGGraphicsElement;

  constructor(
    tempRenderer: RendererFactory2,
    private api: ApiService,
    private drawingService: DrawingService,
    private shapesService: DisplayShapesService,
  ) {
    super();
    this.renderer = tempRenderer.createRenderer(null, null);
    this.fileType = 'png';
    this.subscriptions = [];
    this.uri = '';

    this.subscriptions.push(
      this.api.graph$.subscribe((graph: Graph) => {
        this.drawing = graph;
      }),
    );

    this.subscriptions.push(
      this.shapesService.svgs$.subscribe((svg: Map<SVGGraphicsElement, ShapeAbs>) => {
        this.drawing.shapes = svg;
      }),
    );

    this.subscriptions.push(
      this.drawingService.canvasRef$.subscribe((canvasRef: ElementRef) => {
        this.canvasRef = canvasRef;
      }),
    );

    this.myCanvas = this.renderer.createElement('canvas');
    this.myCanvas.width = this.drawing.width;
    this.myCanvas.height = this.drawing.height;
    this.canvasImage = new Image();
    this.canvasImage.crossOrigin = 'anonymous';
    this.canvasImage.height = this.drawing.height;
    this.canvasImage.width = this.drawing.width;
  }

  xmlToBase64(): string {
    this.ctx = this.myCanvas.getContext('2d');
    const svgXml: string = new XMLSerializer().serializeToString(this.canvasRef
      .nativeElement as Node);
    const uri = 'data:image/svg+xml;base64,' + window.btoa(svgXml);
    return uri;
  }

  xmlToBlob(): Blob {
    this.ctx = this.myCanvas.getContext('2d');
    const canvasToBMP: CanvasToBMP = new CanvasToBMP();
    return canvasToBMP.toBlob(this.myCanvas);
  }

  drawImage(fileType: string, data: string): void {
    this.canvasImage = new Image();
    this.canvasImage.crossOrigin = 'anonymous';
    this.canvasImage.onload = (): void => {
      if (this.ctx) {
        this.ctx.drawImage(this.canvasImage, 0, 0);
        const filename: string = this.drawing.title;
        const anchor: HTMLAnchorElement = document.createElement('a');
        anchor.download = `${filename}.${fileType}`;
        if (fileType === 'bmp') {
          anchor.href = window.URL.createObjectURL(this.xmlToBlob());
        } else {
          anchor.href = this.myCanvas.toDataURL('image/' + fileType, 1.0);
        }
        anchor.click();
      }
    };
    (this.canvasImage as HTMLImageElement).src = data;
  }
  exportToJpeg(): void {
    const uri: string = this.xmlToBase64();
    const fileType = 'jpeg';
    this.drawImage(fileType, uri);
  }
  exportToPng(): void {
    const uri: string = this.xmlToBase64();
    this.drawImage('png', uri);
  }

  exportToBmp(): void {
    const uri: string = this.xmlToBase64();
    this.drawImage('bmp', uri);
  }

  loadBlob(data: Blob): void {
    const filename: string = this.drawing.title;
    const anchor: HTMLAnchorElement = document.createElement('a');
    anchor.download = filename + '.svg';
    anchor.href = window.URL.createObjectURL(data);
    anchor.click();
  }

  exportToSvg(): void {
    const svgXml: string = new XMLSerializer().serializeToString(this.canvasRef.nativeElement);
    const svgData = `<?xml version="1.0" encoding="iso-8859-1"?> ${svgXml}`;
    const data: Blob = new Blob([svgData], { type: 'text/plain' });
    this.loadBlob(data);
  }
}

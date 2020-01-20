import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Point } from 'src/app/core/models/type';
import { Color } from '../../../core/models/color';

/* tslint:disable:no-magic-numbers */

@Component({
  selector: 'app-color-spectrum',
  templateUrl: './color-spectrum.component.html',
  styleUrls: ['./color-spectrum.component.scss'],
})
export class ColorSpectrumComponent implements AfterViewInit, OnChanges {
  @Input() spectrum: Color;
  @Input() h: number;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  private cx: CanvasRenderingContext2D | null;
  isSpectrumSelection: boolean;
  targetPosition: Point;
  canvasEl: HTMLCanvasElement;

  constructor() {
    this.isSpectrumSelection = false;
    this.targetPosition = { x: 0, y: 0 };
  }

  ngAfterViewInit(): void {
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvas.nativeElement.getContext('2d');
    if (this.cx) {
      this.reloadCanvas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.h) {
      this.targetPosition.x = this.h * this.canvas.nativeElement.width;
      this.calculateColorInPostion();
    }
  }

  reloadCanvas(): void {
    if (this.cx) {
      this.cx.fillStyle = 'rgba(255,255,255,1)';
      this.cx.fillRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      );
      this.addShadeGradient();
    }
  }

  addShadeGradient(): void {
    if (this.cx) {
      const rgbaSpectrum: CanvasGradient = this.cx.createLinearGradient(
        0,
        0,
        this.canvas.nativeElement.width,
        0,
      );
      /* tslint:disable:no-magic-number */
      rgbaSpectrum.addColorStop(0, 'rgba(255, 0, 0, 1)');
      rgbaSpectrum.addColorStop(1 / 6, 'rgba(255, 255, 0, 1)');
      rgbaSpectrum.addColorStop(2 / 6, 'rgba(0, 255, 0, 1)');
      rgbaSpectrum.addColorStop(3 / 6, 'rgba(0, 255, 255, 1)');
      rgbaSpectrum.addColorStop(4 / 6, 'rgba(0, 0, 255, 1)');
      rgbaSpectrum.addColorStop(5 / 6, 'rgba(255, 0, 255, 1)');
      rgbaSpectrum.addColorStop(1, 'rgba(255, 0, 0, 1)');
      /* tslint:enable:no-magic-number */
      this.cx.fillStyle = rgbaSpectrum;
      this.cx.fillRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      );
    }
  }

  mouseDownEventHandler(event: MouseEvent): void {
    this.isSpectrumSelection = true;
    this.targetPosition = { x: event.layerX, y: event.layerY };
    this.calculateColorInPostion();
  }

  mouseMoveEventHandler(event: MouseEvent): void {
    if (this.isSpectrumSelection) {
      this.targetPosition = { x: event.layerX, y: event.layerY };
      this.calculateColorInPostion();
    }
  }
  mouseUpEventHandler(event: MouseEvent): void {
    this.isSpectrumSelection = false;
  }
  mouseOutEventHandler(event: MouseEvent): void {
    this.isSpectrumSelection = false;
  }

  calculateColorInPostion(): void {
    if (this.cx) {
      const selectedColor: Uint8ClampedArray = this.cx.getImageData(
        this.targetPosition.x,
        this.targetPosition.y,
        1,
        1,
      ).data;
      this.spectrum.r = selectedColor[0];
      this.spectrum.g = selectedColor[1];
      this.spectrum.b = selectedColor[2];
      this.spectrum.hex = this.spectrum.rgb2hex();
    }
  }
}

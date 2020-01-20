import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Point } from 'src/app/core/models/type';
import { ColorService } from 'src/app/core/services/color/color.service';
import { COLOR_TARGET_SIZE } from '../../../../../../common/constants/constants';
import { Color } from '../../../core/models/color';
import { ColorPickerService } from '../color-picker.service';

@Component({
  selector: 'app-color-gradient',
  templateUrl: './color-gradient.component.html',
  styleUrls: ['./color-gradient.component.scss'],
})
export class ColorGradientComponent
  implements AfterViewInit, OnChanges, OnInit {
  @Input() rgba: Color;
  @Input() spectrumHex: string;
  @Input() spectrum: Color;
  isColorSelection: boolean;
  targetPosition: Point;
  selectedPreviousColor: Color;
  oldPreviousColor: Color;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constructor(
    private colorService: ColorService,
    private colorPicker: ColorPickerService,
  ) {
    this.rgba = this.colorService.primaryColor.copy();
    this.spectrum = this.colorService.primaryColor.copy();
    this.isColorSelection = false;
    this.targetPosition = {
      x: COLOR_TARGET_SIZE,
      y: COLOR_TARGET_SIZE,
    };
    this.oldPreviousColor = this.colorService.primaryColor;
  }

  cx: CanvasRenderingContext2D | null;
  canvasEl: HTMLCanvasElement;

  ngOnInit(): void {
    this.colorPicker.selectedPreviousColor$.subscribe((nextPrevious: Color) => {
      this.selectedPreviousColor = nextPrevious;

      this.reloadCanvas();
      this.calculateColorInPostion();
    });
  }
  ngAfterViewInit(): void {
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvas.nativeElement.getContext('2d');
    this.targetPosition = {
      x: this.canvas.nativeElement.width - COLOR_TARGET_SIZE,
      y: COLOR_TARGET_SIZE,
    };
    if (this.cx) {
      this.reloadCanvas();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.spectrumHex) {
      this.reloadCanvas();
      this.calculateColorInPostion();
    }
  }

  reloadCanvas(): void {
    if (this.cx) {
      if (this.selectedPreviousColor !== this.oldPreviousColor) {
        this.oldPreviousColor = this.selectedPreviousColor;
        this.cx.fillStyle =
          this.selectedPreviousColor.getColorString() || 'rgba(255,255,255,1)';
        this.cx.fillRect(
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height,
        );
      } else {
        this.cx.fillStyle =
          this.spectrum.getColorString() || 'rgba(255,255,255,1)';
        this.cx.fillRect(
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height,
        );
      }
      this.addShadeGradient();
      this.colorService.currentColor = this.rgba;
    }
  }

  addShadeGradient(): void {
    if (this.cx) {
      const whiteShadeGradient: CanvasGradient = this.cx.createLinearGradient(
        0,
        0,
        this.canvas.nativeElement.width,
        0,
      );
      const blackShadeGradient: CanvasGradient = this.cx.createLinearGradient(
        0,
        0,
        0,
        this.canvas.nativeElement.height,
      );

      whiteShadeGradient.addColorStop(0, 'rgba(255,255,255,1)');
      whiteShadeGradient.addColorStop(1, 'rgba(255,255,255,0)');
      this.cx.fillStyle = whiteShadeGradient;
      this.cx.fillRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      );

      blackShadeGradient.addColorStop(0, 'rgba(0,0,0,0)');
      blackShadeGradient.addColorStop(1, 'rgba(0,0,0,1)');
      this.cx.fillStyle = blackShadeGradient;
      this.cx.fillRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height,
      );
    }
  }

  mouseDownEventHandler(event: MouseEvent): void {
    this.isColorSelection = true;
    this.targetPosition = { x: event.layerX, y: event.layerY };
    this.calculateColorInPostion();
  }

  mouseMoveEventHandler(event: MouseEvent): void {
    if (this.isColorSelection) {
      this.targetPosition = { x: event.layerX, y: event.layerY };
      this.calculateColorInPostion();
    }
  }
  mouseUpEventHandler(event: MouseEvent): void {
    this.isColorSelection = false;
  }
  mouseOutEventHandler(event: MouseEvent): void {
    this.isColorSelection = false;
  }

  calculateColorInPostion(): void {
    if (this.cx) {
      const selectedColor: Uint8ClampedArray = this.cx.getImageData(
        this.targetPosition.x,
        this.targetPosition.y,
        1,
        1,
      ).data;

      this.rgba.r = selectedColor[0];
      this.rgba.g = selectedColor[1];
      this.rgba.b = selectedColor[2];
      this.rgba.hex = this.rgba.rgb2hex();
    }
  }
}

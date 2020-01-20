import { Component, Input, OnInit } from '@angular/core';
import { ColorService } from 'src/app/core/services/color/color.service';
import {
  MAX_COLOR_OPACITY,
  ONE_HUNDRED,
} from '../../../../../../common/constants/constants';
import { Color } from '../../../core/models/color';

@Component({
  selector: 'app-color-opacity',
  templateUrl: './color-opacity.component.html',
  styleUrls: ['./color-opacity.component.scss'],
})
export class ColorOpacityComponent implements OnInit {
  @Input() rgba: Color;
  min: number;
  max: number;
  step: number;
  value: number;
  opacity: number;
  autoTicks: boolean;
  disabled: boolean;
  invert: boolean;
  showTicks: boolean;
  thumbLabel: boolean;
  vertical: boolean;

  constructor(private colorService: ColorService) {
    this.autoTicks = false;
    this.disabled = false;
    this.invert = false;
    this.showTicks = false;
    this.step = 1;
    this.thumbLabel = false;
    this.value = 0;
    this.vertical = false;
    this.min = 0;
    this.max = MAX_COLOR_OPACITY;
    this.rgba = this.colorService.primaryColor.copy();
  }

  ngOnInit(): void {
    this.opacity = this.rgba.a * ONE_HUNDRED;
  }

  onChange(): void {
    this.rgba.a = this.opacity / ONE_HUNDRED;
  }
}

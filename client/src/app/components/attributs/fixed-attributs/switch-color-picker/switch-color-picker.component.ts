import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Color } from '../../../../core/models/color';
import { ColorService } from './../../../../core/services/color/color.service';
import { ColorPickerService } from './../../../color-picker/color-picker.service';

@Component({
  selector: 'app-switch-color-picker',
  templateUrl: './switch-color-picker.component.html',
  styleUrls: ['./switch-color-picker.component.scss'],
})
export class SwitchColorPickerComponent extends AbstractSubscriptions implements OnInit {
  primaryColor: Color;
  secondaryColor: Color;
  @Output() selectColor: EventEmitter<unknown> = new EventEmitter();

  constructor(private colorService: ColorService, private colorPicker: ColorPickerService) {
    super();
  }

  modifyColor(selectedBaseColor: string): void {
    this.colorPicker.show();
    if (selectedBaseColor === 'primary') {
      this.colorPicker.changeColor(this.primaryColor, selectedBaseColor);
    } else {
      this.colorPicker.changeColor(this.secondaryColor, selectedBaseColor);
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.colorService.secondaryColor$.subscribe((color: Color) => {
      this.secondaryColor = color;
    }),
      this.colorService.primaryColor$.subscribe((color: Color) => {
        this.primaryColor = color;
      }));
  }

  onSwitch(): void {
    const temp: Color = this.colorService.primaryColor;
    this.colorService.primaryColor = this.colorService.secondaryColor;
    this.colorService.secondaryColor = temp;
  }
}

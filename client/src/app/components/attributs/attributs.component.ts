import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { Color } from './../../core/models/color';

interface Command {
  execute: string;
}
export interface Button {
  iconPath: string;
  active: boolean;
  action: Command;
}

@Component({
  selector: 'app-attributs',
  templateUrl: './attributs.component.html',
  styleUrls: ['./attributs.component.scss'],
})
export class AttributsComponent implements OnInit {
  select: Command;
  modifiedColor: Color;
  showColorPicker: boolean;
  activeButton: string;
  selectButton: Button;
  show: boolean;
  button: Button;
  subscription: Subscription;

  constructor(private colorPicker: ColorPickerService) {
    this.button = this.selectButton;
    this.selectButton = {
      iconPath: '../../../../assets/icons/mouse-pointer.svg',
      active: false,
      action: this.select,
    };
    this.select = { execute: 'select' };
    this.activeButton = 'Attributs';
    this.showColorPicker = false;
  }

  ngOnInit(): void {
    this.subscription = this.colorPicker.show$.subscribe((show: boolean) => {
      this.show = show;
    });
  }

  onSelectColor(selectedColor: Color): void {
    this.showColorPicker = true;
    this.modifiedColor = selectedColor;
  }
}

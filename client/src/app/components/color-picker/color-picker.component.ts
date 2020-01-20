import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorService } from 'src/app/core/services/color/color.service';
import { Color } from '../../core/models/color';
import { ColorPickerService } from './color-picker.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
  @Input() color: Color;
  @Output() colorSelected: EventEmitter<Color>;
  @Input() newDrawing = false;
  spectrum: Color;
  colorType: string;
  initColor: Color;

  constructor(
    private colorService: ColorService,
    private colorPicker: ColorPickerService,
  ) {
    this.color = this.colorService.primaryColor.copy();
    this.spectrum = this.colorService.primaryColor.copy();
    this.colorSelected = new EventEmitter<Color>();
  }

  ngOnInit(): void {
    this.initColor = this.color.copy();
  }

  confirm(): void {
    this.colorSelected.emit(this.color);
    this.colorPicker.addNewPreviousColor(this.color);
    if (!this.newDrawing) {
      this.colorPicker.confirmSelectedColor(this.color);
    }
  }
}

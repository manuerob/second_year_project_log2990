import { Component } from '@angular/core';
import { Color } from 'src/app/core/models/color';
import { ColorService } from 'src/app/core/services/color/color.service';
import { ColorPickerService } from './../color-picker.service';

@Component({
  selector: 'app-previous-colors',
  templateUrl: './previous-colors.component.html',
  styleUrls: ['./previous-colors.component.scss'],
})
export class PreviousColorsComponent {
  constructor(
    private colorPicker: ColorPickerService,
    private colorService: ColorService,
  ) {}

  addNewColor(): void {
    this.colorPicker.addNewPreviousColor(this.colorService.currentColor);
  }
  selectColor(previous: Color): void {
    this.colorPicker.selectedPreviousColor.next(previous);
  }
}

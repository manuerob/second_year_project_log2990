import { Component, OnInit } from '@angular/core';
import { GridService } from '../../../../canvas/grid/grid.service';
import { AbstractSubscriptions } from './../../../../../core/helper/class/abstract-subscriptions';
import { ColorPickerService } from './../../../../color-picker/color-picker.service';

@Component({
  selector: 'app-grid-slider',
  templateUrl: './grid-slider.component.html',
  styleUrls: ['./grid-slider.component.scss'],
})
export class GridSliderComponent extends AbstractSubscriptions implements OnInit {
  checked: boolean;
  showGrid: boolean;
  showColorPicker: boolean;
  constructor(private gridService: GridService, private colorPicker: ColorPickerService) {
    super();
    this.checked = false;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.gridService.showGrid$.subscribe((showGrid: boolean) => {
        this.checked = showGrid;
      }),
      this.colorPicker.show$.subscribe((shown: boolean) => {
        this.showColorPicker = shown;
      }),
    );
  }
  onToggle(): void {
    if (this.showColorPicker) {
      this.colorPicker.hide();
    }
    this.gridService.toggleShowGrid(!this.checked);
  }
}

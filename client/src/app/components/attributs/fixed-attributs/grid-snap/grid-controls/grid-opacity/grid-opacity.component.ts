import { Component } from '@angular/core';
import { GridService } from 'src/app/components/canvas/grid/grid.service';
import { GRID_OPACITY_MAX, GRID_OPACITY_MIN, ONE_HUNDRED } from '../../../../../../../../../common/constants/constants';

@Component({
  selector: 'app-grid-opacity',
  templateUrl: './grid-opacity.component.html',
  styleUrls: ['./grid-opacity.component.scss'],
})
export class GridOpacityComponent {
  min: number;
  max: number;

  constructor(private gridService: GridService) {
    this.min = GRID_OPACITY_MIN;
    this.max = GRID_OPACITY_MAX;
  }
  onUpdateOpacity(newValue: number): void {
    if (newValue >= this.min && newValue <= this.max) {
      this.gridService.opacity = newValue / ONE_HUNDRED;
    }
  }
}

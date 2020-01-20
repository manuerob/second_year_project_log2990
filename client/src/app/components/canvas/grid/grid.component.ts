import { Component, OnInit } from '@angular/core';
import { DEFAULT_OPACITY, DEFAULT_PATH_BIG_GRID,
         DEFAULT_PATH_SMALL_GRID, DEFAULT_SHOWGRID } from '../../../../../../common/constants/constants';
import { DrawingService } from './../../../core/services/drawing/drawing.service';
import { GridService } from './grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  gridHeight: number;
  gridWidth: number;
  showGrid: boolean;
  opacity: number;
  dPathSmallGrid: string;
  dPathBigGrid: string;

  constructor(
    private drawingService: DrawingService,
    private gridService: GridService,
  ) {
    this.opacity =  DEFAULT_OPACITY;
    this.showGrid = DEFAULT_SHOWGRID;
    this.dPathBigGrid = DEFAULT_PATH_BIG_GRID;
    this.dPathSmallGrid = DEFAULT_PATH_SMALL_GRID;
  }
  ngOnInit(): void {
    this.drawingService.height$.subscribe((height: number) => {
      this.gridHeight = height;
    });

    this.drawingService.width$.subscribe((width: number) => {
      this.gridWidth = width;
    });

    this.gridService.showGrid$.subscribe((showGrid: boolean) => {
      this.showGrid = true;
    });
  }
}

import { Component, HostListener, OnInit } from '@angular/core';
import { GridService } from 'src/app/components/canvas/grid/grid.service';
import { HotkeyManagerService } from 'src/app/core/services/hotkey/hotkey-manager.service';
import { GRID_SIZE_MAX, GRID_SIZE_MIN, TEN } from '../../../../../../../../../common/constants/constants';
import { AbstractSubscriptions } from './../../../../../../core/helper/class/abstract-subscriptions';
import { SnappingService } from './../../../../../../core/services/shape-service/select-handler/snapping/snapping.service';

@Component({
  selector: 'app-grid-sizesquare',
  templateUrl: './grid-sizesquare.component.html',
  styleUrls: ['./grid-sizesquare.component.scss'],
})
export class GridSizesquareComponent extends AbstractSubscriptions implements OnInit {
  readonly min: number;
  readonly max: number;
  snapping: boolean;
  grid: boolean;

  constructor(private snapService: SnappingService, private gridService: GridService, private hotkeys: HotkeyManagerService) {
    super();
    this.min = GRID_SIZE_MIN;
    this.max = GRID_SIZE_MAX;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.snapService.activeSnapping$.subscribe((snapping: boolean) => {
        this.snapping = snapping;
      }),
      this.gridService.showGrid$.subscribe((showGrid: boolean) => {
        this.grid = showGrid;
      }),
    );
  }

  onUpdateSizeBigSquare(newValue: number): void {
    if (newValue >= this.min && newValue <= this.max) {
      this.gridService.sizeSmallSquare = newValue / TEN;
      this.gridService.sizeBigSquare = newValue;
    }
  }

  @HostListener('document:keydown.=', ['$event'])
  @HostListener('document:keydown.+', ['$event'])
  increaseGridSize($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.onUpdateSizeBigSquare((this.gridService.sizeBigSquare += 5));
    }
  }

  @HostListener('document:keydown.-', ['$event'])
  decreaseGridSize($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.onUpdateSizeBigSquare((this.gridService.sizeBigSquare -= 5));
    }
  }
}

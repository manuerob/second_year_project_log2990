import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridService } from '../../canvas/grid/grid.service';
import { AttributsService } from '../attributs.service';
import { ColorPickerService } from './../../color-picker/color-picker.service';

interface Command {
  execute: string;
}
export interface Button {
  iconPath: string;
  active: boolean;
  action: Command;
}

@Component({
  selector: 'app-fixed-attributs',
  templateUrl: './fixed-attributs.component.html',
  styleUrls: ['./fixed-attributs.component.scss'],
})
export class FixedAttributsComponent implements OnInit {
  history: Command;
  historyButton: Button;
  colorPickerButton: Button;
  fixedbuttons: Button[];
  showGrid: boolean;
  activeSnapping: boolean;
  snappingPointChoices: Map<string, string>;
  snappingPoint: string;
  sub: Subscription;

  constructor(private colorPicker: ColorPickerService, private gridService: GridService, private attributsService: AttributsService, ) {
    this.fixedbuttons = [this.colorPickerButton, this.historyButton];
    this.snappingPointChoices = this.attributsService.snappingPointChoices;
    this.snappingPoint = this.attributsService.attributs.snappingPoint;
  }
  ngOnInit(): void {
    if (this.colorPicker.isShown) {
      this.colorPicker.hide();
    }

    this.sub = this.gridService.showGrid$.subscribe((showGrid: boolean) => {
      this.showGrid = showGrid;
    });

  }
}

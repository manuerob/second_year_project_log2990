import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from '../../../../core/models/attributs';
import { AttributsService } from './../../attributs.service';

@Component({
  selector: 'app-rectangle-controls',
  templateUrl: './rectangle-controls.component.html',
  styleUrls: ['./rectangle-controls.component.scss'],
})
export class RectangleControlsComponent extends AbstractSubscriptions implements OnInit {
  width: number;
  plotTypes: Map<string, string>;
  currentPlotType: string;

  constructor(private attributsService: AttributsService) {
    super();
    this.plotTypes = attributsService.plotTypes;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.attributsService.attributs$.subscribe((attributs: Attributs) => {
      this.width = attributs.width;
      this.currentPlotType = attributs.plotType;
    }), );
  }

  onWidthChange(newValue: number): void {
    this.attributsService.attributs.width = newValue;
  }

  onPlotTypeChange(newValue: string): void {
    this.attributsService.attributs.plotType = newValue;
  }
}

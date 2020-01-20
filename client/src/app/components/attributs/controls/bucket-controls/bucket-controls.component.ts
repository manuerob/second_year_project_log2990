import { Component, OnInit } from '@angular/core';
import { Attributs } from 'src/app/core/models/attributs';
import { AttributsService } from '../../attributs.service';
import { AbstractSubscriptions } from './../../../../core/helper/class/abstract-subscriptions';

@Component({
  selector: 'app-bucket-controls',
  templateUrl: './bucket-controls.component.html',
  styleUrls: ['./bucket-controls.component.scss'],
})
export class BucketControlsComponent extends AbstractSubscriptions implements OnInit {
  strokeWidth: number;
  tolerance: number;
  plotTypes: Map<string, string>;
  currentPlotType: string;

  constructor(private attributsService: AttributsService) {
    super();
    this.plotTypes = attributsService.plotTypes;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.strokeWidth = attributs.width;
        this.tolerance = attributs.tolerance;
        this.currentPlotType = attributs.plotType;
      }),
    );
  }

  onStrokeWidthChange(newValue: number): void {
    this.attributsService.attributs.width = newValue;
  }

  onToleranceChange(newValue: number): void {
    this.attributsService.attributs.tolerance = newValue;
  }

  onPlotTypeChange(newValue: string): void {
    this.attributsService.attributs.plotType = newValue;
  }
}

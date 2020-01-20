import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from 'src/app/core/models/attributs';
import { AttributsService } from '../../attributs.service';

@Component({
  selector: 'app-stamp-controls',
  templateUrl: './stamp-controls.component.html',
  styleUrls: ['./stamp-controls.component.scss'],
})
export class StampControlsComponent extends AbstractSubscriptions implements OnInit {
  scaleFactor: number;
  angle: number;
  currentStampChoice: number;
  stampChoices: Map<number, string>;

  constructor(private attributsService: AttributsService) {
    super();
    this.stampChoices = attributsService.stampChoices;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.attributsService.attributs$.subscribe(
      (attributs: Attributs) => {
        this.scaleFactor = attributs.scaleFactor;
        this.angle = attributs.angle;
        this.currentStampChoice = attributs.stampChoice;
      },
    ), );
  }

  onScaleFactorChange(newValue: number): void {
    this.attributsService.attributs.scaleFactor = newValue;
  }

  onStampChoiceChange(newValue: number): void {
    this.attributsService.attributs.stampChoice = newValue;
  }
  onAngleChange(newValue: number): void {
    this.attributsService.attributs.angle = newValue;
  }
}

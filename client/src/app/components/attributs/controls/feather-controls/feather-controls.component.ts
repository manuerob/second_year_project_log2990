import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import {
  MAX_FEATHER_WIDTH,
  MIN_FEATHER_WIDTH,
} from '../../../../../../../common/constants/constants';
import { Attributs } from '../../../../core/models/attributs';
import { AttributsService } from './../../attributs.service';

@Component({
  selector: 'app-feather-controls',
  templateUrl: './feather-controls.component.html',
  styleUrls: ['./feather-controls.component.scss'],
})
export class FeatherControlsComponent extends AbstractSubscriptions
  implements OnInit {
  featherWidth: number;
  angle: number;
  featherLength: number;
  checked: boolean;

  constructor(private attributsService: AttributsService) {
    super();
    this.checked = false;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.featherWidth = attributs.featherWidth;
        this.angle = attributs.angle;
        this.featherLength = attributs.featherLength;
      }),
    );
    this.featherWidth === MIN_FEATHER_WIDTH
      ? (this.checked = false)
      : (this.checked = true);
  }

  onWidthChange(): void {
    if (this.checked) {
      this.attributsService.attributs.featherWidth = MAX_FEATHER_WIDTH;
    } else {
      this.attributsService.attributs.featherWidth = MIN_FEATHER_WIDTH;
    }
  }

  onFeatherLengthChange(length: number): void {
    this.attributsService.attributs.featherLength = length;
  }

  onAngleChange(newValue: number): void {
    this.attributsService.attributs.angle = newValue;
  }
}

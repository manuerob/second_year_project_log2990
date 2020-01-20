import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { SnappingService } from 'src/app/core/services/shape-service/select-handler/snapping/snapping.service';
import {
  DEFAULT_SNAPPING_POINT,
  DEFAULT_SNAPPING_POINT_CHOICES,
} from '../../../../../../../../common/constants/constants';

@Component({
  selector: 'app-snapping-controls',
  templateUrl: './snapping-controls.component.html',
  styleUrls: ['./snapping-controls.component.scss'],
})
export class SnappingControlsComponent extends AbstractSubscriptions
  implements OnInit {
  currentSnappingPoint: string;
  snappingPointChoices: Map<string, string>;

  constructor(private snappingService: SnappingService) {
    super();
    this.currentSnappingPoint = DEFAULT_SNAPPING_POINT;
    this.snappingPointChoices = DEFAULT_SNAPPING_POINT_CHOICES;
  }

  ngOnInit(): void {
    this.snappingPointChoices = DEFAULT_SNAPPING_POINT_CHOICES;
  }
  onSnappinPointChange(newValue: string): void {
    this.snappingService.snappingPoint = newValue;
  }
}

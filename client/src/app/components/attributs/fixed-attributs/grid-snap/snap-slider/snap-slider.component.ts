import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { DEFAULT_ACTIVE_SNAPPING } from '../../../../../../../../common/constants/constants';
import { SnappingService } from './../../../../../core/services/shape-service/select-handler/snapping/snapping.service';
import { ColorPickerService } from './../../../../color-picker/color-picker.service';

@Component({
  selector: 'app-snap-slider',
  templateUrl: './snap-slider.component.html',
  styleUrls: ['./snap-slider.component.scss'],
})
export class SnapSliderComponent extends AbstractSubscriptions implements OnInit {
  checked: boolean;
  colorpickerShown: boolean;
  constructor(private colorPicker: ColorPickerService, private snappingService: SnappingService) {
    super();
    this.checked = DEFAULT_ACTIVE_SNAPPING;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.snappingService.activeSnapping$.subscribe((showActiveSnapping: boolean) => {
        this.checked = showActiveSnapping;
      }),
      this.colorPicker.show$.subscribe((shown: boolean) => {
        this.colorpickerShown = shown;
      }),
    );
  }

  onToggle(): void {
    if (this.colorpickerShown) {
      this.colorPicker.hide();
    }
    this.snappingService.toggleActiveSnapping(!this.checked);
  }
}

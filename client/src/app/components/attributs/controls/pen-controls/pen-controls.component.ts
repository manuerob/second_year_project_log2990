import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from 'src/app/core/models/attributs';
import { AttributsService } from '../../attributs.service';

@Component({
  selector: 'app-pen-controls',
  templateUrl: './pen-controls.component.html',
  styleUrls: ['./pen-controls.component.scss'],
})
export class PenControlsComponent extends AbstractSubscriptions
  implements OnInit {
  width: number;
  minWidth: number;
  minimumName: string;
  maximumName: string;

  constructor(private attributsService: AttributsService) {
    super();
    this.minimumName = 'Minimum';
    this.maximumName = 'Maximum';
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.width = attributs.width;
        this.minWidth = attributs.minWidth;
      }),
    );
  }

  onMaxWidthChange(value: number): void {
    if (value < this.attributsService.attributs.minWidth) {
      this.attributsService.changeMinWidth(value);
      this.attributsService.changeWidth(value);
    } else {
      this.attributsService.changeWidth(value);
    }
  }

  onMinWidthChange(value: number): void {
    if (value > this.attributsService.attributs.width) {
      this.attributsService.changeWidth(value);
      this.attributsService.changeMinWidth(value);
    } else {
      this.attributsService.changeMinWidth(value);
    }
  }
}

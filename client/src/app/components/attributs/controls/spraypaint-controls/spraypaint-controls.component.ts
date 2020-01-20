import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from 'src/app/core/models/attributs';
import { AttributsService } from '../../attributs.service';

@Component({
  selector: 'app-spraypaint-controls',
  templateUrl: './spraypaint-controls.component.html',
  styleUrls: ['./spraypaint-controls.component.scss'],
})
export class SpraypaintControlsComponent extends AbstractSubscriptions
  implements OnInit {
  width: number;
  emissionRate: number;

  constructor(private attributsService: AttributsService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.width = attributs.width;
        this.emissionRate = attributs.emissionRate;
      }),
    );
  }

  onWidthChange(value: number): void {
    this.attributsService.attributs.width = value;
  }

  onEmissionRateChange(value: number): void {
    this.attributsService.attributs.emissionRate = value;
  }
}

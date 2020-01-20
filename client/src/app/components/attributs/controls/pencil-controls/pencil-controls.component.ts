import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from '../../../../core/models/attributs';
import { AttributsService } from './../../attributs.service';

@Component({
  selector: 'app-pencil-controls',
  templateUrl: './pencil-controls.component.html',
  styleUrls: ['./pencil-controls.component.scss'],
})
export class PencilControlsComponent extends AbstractSubscriptions
  implements OnInit {
  width: number;

  constructor(private attributsService: AttributsService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.width = attributs.width;
      }),
    );
  }

  onWidthChange(width: number): void {
    this.attributsService.attributs.width = width;
  }
}

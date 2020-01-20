import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from 'src/app/core/models/attributs';
import { AttributsService } from './../../../attributs.service';

@Component({
  selector: 'app-erase-controls',
  templateUrl: './erase-controls.component.html',
  styleUrls: ['./erase-controls.component.scss'],
})
export class EraseControlsComponent extends AbstractSubscriptions implements OnInit {
  eraseSize: number;
  constructor(private attributsService: AttributsService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.eraseSize = attributs.eraseSize;
      }),
    );
  }

  onEraseSizeChange(newValue: number): void {
    this.attributsService.attributs.eraseSize = newValue;
  }
}

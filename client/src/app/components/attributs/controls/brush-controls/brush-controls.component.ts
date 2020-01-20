import { Component, OnInit } from '@angular/core';
import { Attributs } from './../../../../core/models/attributs';
import { AttributsService } from './../../attributs.service';

import { Subscription } from 'rxjs';
import { BRUSH_STARTING_WIDTH } from '../../../../../../../common/constants/constants';

@Component({
  selector: 'app-brush-controls',
  templateUrl: './brush-controls.component.html',
  styleUrls: ['./brush-controls.component.scss'],
})
export class BrushControlsComponent implements OnInit {
  textures: Map<string, string>;
  width: number;
  currentTexture: string;
  subscription: Subscription;

  constructor(private attributsService: AttributsService) {
    this.width = BRUSH_STARTING_WIDTH;
    this.textures = attributsService.textures;
  }

  ngOnInit(): void {
    this.subscription = this.attributsService.attributs$.subscribe(
      (attributs: Attributs) => {
        this.width = attributs.width;
        this.currentTexture = attributs.texture;
      },
    );
  }

  onWidthChange(width: number): void {
    this.attributsService.attributs.width = width;
  }

  onSelectChange(newValue: string): void {
    this.attributsService.attributs.texture = newValue;
  }
}

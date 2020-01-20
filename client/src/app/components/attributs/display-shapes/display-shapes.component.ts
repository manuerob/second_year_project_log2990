import { Component, OnInit } from '@angular/core';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';

@Component({
  selector: 'app-display-shapes',
  templateUrl: './display-shapes.component.html',
  styleUrls: ['./display-shapes.component.scss'],
})
export class DisplayShapesComponent extends AbstractSubscriptions implements OnInit {
  svgs: Map<SVGGraphicsElement, ShapeAbs>;
  constructor(private svgsService: DisplayShapesService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.svgsService.svgs$.subscribe((svgs: Map<SVGGraphicsElement, ShapeAbs>) => {
        this.svgs = svgs;
      }),
    );
  }
}

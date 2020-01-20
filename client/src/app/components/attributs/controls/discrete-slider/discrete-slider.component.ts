import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-discrete-slider',
  templateUrl: './discrete-slider.component.html',
  styleUrls: ['./discrete-slider.component.scss'],
})
export class DiscreteSliderComponent {
  @Input() name: string;
  @Input() value: number;

  constructor() { this.value = 0; }
}

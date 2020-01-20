import { Component, OnInit } from '@angular/core';
import { RectangleControlsComponent } from '../rectangle-controls/rectangle-controls.component';

@Component({
  selector: 'app-circle-controls',
  templateUrl: './circle-controls.component.html',
  styleUrls: ['./circle-controls.component.scss'],
})
export class CircleControlsComponent extends RectangleControlsComponent implements OnInit {}

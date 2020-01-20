import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-custom-dropdown-list',
  templateUrl: './custom-dropdown-list.component.html',
  styleUrls: ['./custom-dropdown-list.component.scss'],
})
export class DropdownListComponent {
  @Input() title: string;
  @Input() currentValue: string;
  @Input() values: Map<string, string>;
  @Output() valueChanged: EventEmitter<string>;
  constructor() {
    this.currentValue = '';
    this.values = new Map();
    this.title = '';
    this.valueChanged = new EventEmitter();
  }

  onValueChanged(event: MatSelectChange): void {
    this.valueChanged.emit(event.value);
  }
}

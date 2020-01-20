import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss'],
})
export class TabButtonComponent {
  @Input() name: string;
  @Output() changeActiveButton: EventEmitter<string> = new EventEmitter<string>();
  @Input() activeButton: string;
  constructor() { return; }

  onclick(): void {
    this.changeActiveButton.emit(this.name);
  }
}

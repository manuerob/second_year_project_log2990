import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
})
export class CustomButtonComponent {
  @Input() name: string;
  @Input() warning: boolean;
  @Input() cancel: boolean;
  @Input() disabled: boolean;
  @Output() clicked: EventEmitter<boolean>;
  constructor() {
    this.clicked = new EventEmitter();
    this.disabled = false;
    this.warning = false;
    this.cancel = false;
  }

  onClick(): void {
    this.clicked.emit(true);
  }
}

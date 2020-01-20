import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HotkeyManagerService } from './../../core/services/hotkey/hotkey-manager.service';
@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent {
  @Input() value: number;
  @Input() name: string;
  @Input() min: number;
  @Input() max: number;
  @Output() valueChanged: EventEmitter<number>;

  constructor(private hotkeys: HotkeyManagerService) {
    this.valueChanged = new EventEmitter();
  }

  onValueChange(newValue: number): void {
    if (newValue >= this.min && newValue <= this.max) {
      this.valueChanged.emit(newValue);
    } else if (newValue > this.max) {
      this.value = this.max;
      this.valueChanged.emit(this.max);
    } else if (newValue < this.min) {
      this.value = this.min;
      this.valueChanged.emit(this.min);
    }
  }

  onBlur(): void {
    this.hotkeys.available = true;
  }
  onFocus(): void {
    this.hotkeys.available = false;
  }
}

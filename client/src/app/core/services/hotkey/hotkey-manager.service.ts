import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomModalService } from './../modal/custom-modal.service';

@Injectable({
  providedIn: 'root',
})
export class HotkeyManagerService {
  private readonly hotkeysSubject: BehaviorSubject<Record<string, boolean>>;
  readonly hotkeys$: Observable<Record<string, boolean>>;
  available: boolean;

  constructor(private modal: CustomModalService) {
    this.hotkeysSubject = new BehaviorSubject<Record<string, boolean>>({
      KeyJ: false,
      KeyN: false,
      ControlLeft: false,
      ShiftLeft: false,
    });
    this.available = true;
  }

  get hotkeys(): Record<string, boolean> {
    return this.hotkeysSubject.getValue();
  }

  set hotkeys(colors: Record<string, boolean>) {
    this.hotkeysSubject.next(colors);
  }

  udpateHotkeys($event: KeyboardEvent): void {
    if ($event.type === 'keydown') {
      this.hotkeys[$event.code] = true;
    } else if ($event.type === 'keyup') {
      this.hotkeys[$event.code] = false;
    }
  }

  isAvailable(): boolean {
    return !this.modal.isModalOpen && this.available;
  }
}

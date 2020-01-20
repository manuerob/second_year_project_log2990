import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DEFAULT_BACKGROUND_COLOR } from '../../../common/constants/constants';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { CommandManagerService } from './core/services/command-manager/command-manager.service';
import { HotkeyManagerService } from './core/services/hotkey/hotkey-manager.service';

const STORAGE_KEY = 'checkboxStatus';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string;
  message: BehaviorSubject<string>;
  isChecked: boolean;

  constructor(
    private hotkeyManager: HotkeyManagerService,
    private dialog: MatDialog,
    private api: ApiService,
    private commandManager: CommandManagerService,
  ) {
    this.title = 'Pixie';
    this.message = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    this.isChecked = false;
    this.getOnSessionStorage();
    if (!this.isChecked) {
      this.openWindow();
    }

    const canvas = document.getElementById('canvas');
    if (canvas) {
      this.api.graph = {
        title: 'sans-titre',
        id: '',
        htmlElement: '',
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
        tags: [],
        shapes: new Map(),
        createdAt: 0,
      };
    }
  }

  getOnSessionStorage(): void {
    const currentIsChecked: string | false =
      sessionStorage.getItem(STORAGE_KEY) || false;
    this.isChecked = currentIsChecked === 'true';
  }

  openWindow(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(WelcomeWindowComponent, dialogConfig);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent): void {
    this.hotkeyManager.udpateHotkeys($event);
  }
  @HostListener('document:keyup', ['$event'])
  onKeyUp($event: KeyboardEvent): void {
    this.hotkeyManager.udpateHotkeys($event);
  }

  @HostListener('document:keydown.control.z', ['$event'])
  undo($event: KeyboardEvent): void {
    if (this.hotkeyManager.isAvailable()) {
      $event.preventDefault();
      this.commandManager.undo();
    }
  }

  @HostListener('document:keydown.control.shift.z', ['$event'])
  redo($event: KeyboardEvent): void {
    if (this.hotkeyManager.isAvailable()) {
      $event.preventDefault();
      this.commandManager.redo();
    }
  }
}

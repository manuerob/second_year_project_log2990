import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class CustomModalService {
  isModalOpen: boolean;
  config: MatDialogConfig;

  constructor(private modal: MatDialog) {
    this.config = new MatDialogConfig();
    this.isModalOpen = false;
    this.config.disableClose = true;
    this.config.autoFocus = false;
    this.config.width = 'auto';
  }

  close(): void {
    this.isModalOpen = false;
  }

  // tslint:disable-next-line: no-any
  open(element: any, customConfig?: MatDialogConfig): void {
    if (customConfig) {
      this.modal.open(element, customConfig);
    } else {
      this.modal.open(element, this.config);
    }
    this.isModalOpen = true;
  }
}

import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CustomModalService } from './../../../core/services/modal/custom-modal.service';

@Component({
  selector: 'app-user-guide-window',
  templateUrl: './user-guide-window.component.html',
  styleUrls: ['./user-guide-window.component.scss'],
})
export class UserGuideWindowComponent {
  constructor(public dialogRef: MatDialogRef<UserGuideWindowComponent>, private modal: CustomModalService) { }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydownHandler(): void {
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close();
    this.modal.close();
  }
}

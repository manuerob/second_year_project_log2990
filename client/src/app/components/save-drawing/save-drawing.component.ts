import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { ERROR_MESSAGE } from '../../../../../common/constants/constants';
import { DisplayShapesService } from '../attributs/display-shapes/service/display-shapes.service';
import { CustomModalService } from './../../core/services/modal/custom-modal.service';
import { SaveDrawingService } from './service/save-drawing.service';

@Component({
  selector: 'app-save-drawing',
  templateUrl: './save-drawing.component.html',
  styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
  visible: boolean;
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  error: string;
  emptyCanvas: boolean;
  tags: string[];
  fileName: FormControl;
  drawing: SafeHtml;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private savedDrawing: SaveDrawingService,
    private svgsService: DisplayShapesService,
    private dialogRef: MatDialogRef<SaveDrawingComponent>,
    private modal: CustomModalService,
  ) {
    this.visible = true;
    this.selectable = true;
    this.removable = true;
    this.emptyCanvas = false;
    this.error = '';
    this.addOnBlur = true;
    this.drawing = this.savedDrawing.graph.htmlElement;
    this.tags = [];
    this.fileName = new FormControl(this.savedDrawing.graph.title, Validators.required);
  }

  ngOnInit(): void {
    this.savedDrawing.updateSavedImage();
    this.emptyCanvas = this.svgsService.isEmpty();
    this.drawing = this.savedDrawing.graph.htmlElement;
  }

  add(event: MatChipInputEvent): void {
    const regex: RegExp = /\W/g;
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    if ((value || '').trim()) {
      if (!value.match(regex)) {
        this.tags.push(value.trim());
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index: number = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  canSave(): boolean {
    if (this.drawing) {
      return this.drawing && this.fileName.valid;
    }
    return true;
  }

  onSave(): void {
    this.savedDrawing.save(this.fileName.value, this.tags);
    if (!this.fileName.hasError('required')) {
      this.onClose();
    } else {
      this.error = ERROR_MESSAGE;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydownHandler(): void {
    this.onClose();
  }

  onClose(): void {
    this.modal.close();
    this.dialogRef.close();
  }

  getErrorMessage(): string {
    return this.fileName.hasError('required') ? 'Vous devez rentrer une valeur valide' : '';
  }

  saveAs(): void {
    const data: string = this.savedDrawing.saveAs(this.fileName.value, this.tags);
    const jsonData: string = JSON.stringify(data);
    if (!this.fileName.hasError('required')) {
      this.writeContentsToFile(jsonData, 'Sample File' + '.txt', 'text/plain');
      this.onClose();
    } else {
      this.error = ERROR_MESSAGE;
    }
  }

  private writeContentsToFile(content: string, fileName: string, contentType: string): void {
    const a: HTMLAnchorElement = document.createElement('a');
    const fileContent: Blob = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(fileContent);
    a.download = fileName;
    a.click();
  }
}

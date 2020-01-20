import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { SafeHtml } from '@angular/platform-browser';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { DisplayShapesService } from '../../attributs/display-shapes/service/display-shapes.service';
import { ExportDrawingService } from '../export-drawing-service/export-drawing.service';
import { CustomModalService } from './../../../core/services/modal/custom-modal.service';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit {
  visible: boolean;
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  error: string;
  tags: string[];
  fileName: FormControl;
  drawing: SafeHtml;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private savedDrawing: SaveDrawingService,
    private modal: CustomModalService,
    private exportedDrawing: ExportDrawingService,
    private svgsService: DisplayShapesService,
    private dialogRef: MatDialogRef<ExportDrawingComponent>,
  ) {
    this.visible = true;
    this.selectable = true;
    this.removable = true;
    this.error = '';
    this.addOnBlur = true;
    this.tags = [];
    this.fileName = new FormControl(this.exportedDrawing.drawing.title, Validators.required);
  }

  ngOnInit(): void {
    this.drawing = this.savedDrawing.graph.htmlElement;
  }

  get emptyCanvas(): boolean {
    return this.svgsService.isEmpty();
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

  canExport(): boolean {
    if (this.drawing) {
      return this.drawing && this.fileName.valid;
    }
    return true;
  }

  onExportJpeg(): void {
    this.exportedDrawing.exportToJpeg();
    if (!this.fileName.hasError('required')) {
      this.onClose();
    } else {
      this.error = 'not able to export';
    }
  }
  onExportBmp(): void {
    this.exportedDrawing.exportToBmp();
    if (!this.fileName.hasError('required')) {
      this.onClose();
    } else {
      this.error = 'not able to export';
    }
  }

  onExportPng(): void {
    this.exportedDrawing.exportToPng();
    if (!this.fileName.hasError('required')) {
      this.onClose();
    } else {
      this.error = 'not able to export';
    }
  }
  onExportSvg(): void {
    this.exportedDrawing.exportToSvg();
    if (!this.fileName.hasError('required')) {
      this.onClose();
    } else {
      this.error = 'not able to export';
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
    return this.fileName.hasError('required')
      ? 'Vous devez rentrer une valeur valide'
      : '';
  }
}

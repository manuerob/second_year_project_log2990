import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Color } from 'src/app/core/models/color';
import { DrawingService } from '../../../core/services/drawing/drawing.service';
import { CustomModalService } from './../../../core/services/modal/custom-modal.service';
import { DisplayShapesService } from './../../attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from './../../save-drawing/service/save-drawing.service';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit {
  dontSave: boolean;
  constructor(
    private svgsService: DisplayShapesService,
    private drawingService: DrawingService,
    private saveDrawing: SaveDrawingService,
    public dialogRef: MatDialogRef<DrawingComponent>,
    private modal: CustomModalService,
  ) {
    this.dontSave = true;
  }

  ngOnInit(): void {
    this.drawingService.initializeFormGroup();
  }

  get emptyCanvas(): boolean {
    return this.svgsService.isEmpty();
  }

  onCreate(): void {
    if (this.drawingService.isFormValid()) {
      this.drawingService.createDrawing();
      this.drawingService.initializeFormGroup();
      this.onClose();
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

  canDraw(): boolean {
    if (this.saveDrawing) {
      return !this.emptyCanvas && !this.saveDrawing.currentGraphSaved;
    }
    return true;
  }

  changeCanvasColor($event: Color): void {
    this.drawingService.changeCurrentColor($event);
  }

  dontSaveOld(): void {
    this.dontSave = false;
  }

  onSaveOld(): void {
    this.saveDrawing.save();
  }
}

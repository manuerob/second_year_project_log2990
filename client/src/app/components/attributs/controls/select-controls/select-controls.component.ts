import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClipboardService } from 'src/app/core/services/clipboard-service/clipboard.service';
import { SelectHandlerService } from 'src/app/core/services/shape-service/select-handler/select-handler.service';

@Component({
  selector: 'app-select-controls',
  templateUrl: './select-controls.component.html',
  styleUrls: ['./select-controls.component.scss'],
})
export class SelectControlsComponent {
  sub: Subscription;
  constructor(
    private selectionHandler: SelectHandlerService,
    private clipboard: ClipboardService,
  ) {}

  cannotPaste(): boolean {
    return this.clipboard.isClipboardEmpty;
  }

  canCopy(): boolean {
    return this.selectionHandler.shape ? (this.selectionHandler.shape.shapes.length !== 0) : false;
  }

  copy(): void {
    this.selectionHandler.onCopy();
  }

  paste(): void {
    this.selectionHandler.onPaste();
  }

  duplicate(): void {
    this.selectionHandler.onDuplicate();
  }

  cut(): void {
    this.selectionHandler.onCut();
  }
}

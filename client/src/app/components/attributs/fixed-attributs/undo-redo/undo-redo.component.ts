import { Component } from '@angular/core';
import { CommandManagerService } from './../../../../core/services/command-manager/command-manager.service';

@Component({
  selector: 'app-undo-redo',
  templateUrl: './undo-redo.component.html',
  styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent {
  constructor(private commandManager: CommandManagerService) {}

  undo(): void {
    this.commandManager.undo();
  }

  redo(): void {
    this.commandManager.redo();
  }
}

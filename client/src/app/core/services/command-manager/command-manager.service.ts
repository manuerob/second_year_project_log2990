import { Injectable } from '@angular/core';
import { STARTING_POSITION } from '../../../../../../common/constants/constants';
import ICommand from './../../models/i-command';

@Injectable({
  providedIn: 'root',
})
export class CommandManagerService {
  commands: ICommand[];
  currentCommandPosition: number;
  // tslint:disable-next-line: no-any
  service: any;

  constructor() {
    this.commands = [];
    this.currentCommandPosition = STARTING_POSITION;
  }

  addCommand(newCommand: ICommand): void {
    if (this.currentCommandPosition < this.commands.length - 1) {
      this.commands.splice(this.currentCommandPosition + 1);
    }
    this.commands.push(newCommand);
    this.currentCommandPosition++;
  }

  undoAll(): void {
    for (const command of this.commands) {
      command.undo();
    }
  }

  redoAll(): void {
    for (const command of this.commands) {
      command.execute();
    }
  }

  redo(): void {
    if (this.currentCommandPosition < this.commands.length - 1) {
      this.commands[++this.currentCommandPosition].execute();
    }
  }

  undo(): void {
    // tslint:disable-next-line: no-magic-numbers
    if (this.currentCommandPosition > -1) {
      this.commands[this.currentCommandPosition--].undo();
    }
  }

  coercePositionValue(position: number): number {
    if (position < 0) {
      return 0;
    }
    if (position > this.commands.length) {
      return this.commands.length - 1;
    }
    return position;
  }
}

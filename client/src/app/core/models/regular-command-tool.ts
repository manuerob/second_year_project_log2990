import { ToolCommandAbs } from './tool-command-abs';

export default class RegularCommandTool implements ToolCommandAbs {
  command: string;
  constructor(command: string) {
    this.command = command;
  }
  execute(): string {
    return this.command;
  }
  undo(): string {
    return `${this.command}-undo`;
  }
}

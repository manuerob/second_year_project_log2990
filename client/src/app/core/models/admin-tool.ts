import { Type } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { Button } from './button';
import { ToolAbs } from './tool-abs';
import { ToolCommandAbs } from './tool-command-abs';

export default interface AdminTool extends ToolAbs {
  title: string;
  // tslint:disable-next-line: no-any
  modalComponent: Type<any>;
  button: Button;
  command?: ToolCommandAbs;
  modalConfig?: MatDialogConfig;
}

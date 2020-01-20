import { Button } from './button';

import { Type } from '@angular/core';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { ToolAbs } from './tool-abs';
import { ToolCommandAbs } from './tool-command-abs';

export interface Tool extends ToolAbs {
  title: string;
  // tslint:disable-next-line: no-any
  controlsComponent: Type<any>;
  command: ToolCommandAbs;
  button: Button;
  service: Type<IShapeHandler>;
}

import { ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color } from './color';
import { Point } from './type';

export interface IShapeHandler {
  subscriptions: Subscription[];
  primaryColor: Color;
  secondaryColor: Color;
  startingPoint: Point;
  canvasRef: ElementRef;

  onMouseDown(event: MouseEvent): void;
  onMouseMove(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onEscPressed?(): void;
  onShiftDown(isKeyDown: boolean): void;
  onDoubleClick?(event: MouseEvent): void;
  onClick?(event: MouseEvent): void;
  onMouseWheel?(event: WheelEvent): void;
  onMouseEnter?(event: MouseEvent): void;
  onMouseLeave?(event: MouseEvent): void;
  onEnter?(event: KeyboardEvent): void;
  onBackspace?(): void;
  onCopy?(): void;
  onDelete?(): void;
  onCut?(): void;
  onSelectAll?(): void;
  onPaste?(): void;
  onDuplicate?(): void;
  onKeyDown?(event: KeyboardEvent): void;
  ngOnDestroy(): void;
  reset(): void;
}

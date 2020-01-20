import Canvas from './canvas';

export class DrawingManager {
  currentCanvas: Canvas;
  canvasList: Canvas[];

  constructor() {
    this.currentCanvas = new Canvas({ x: 0, y: 0 });
  }
  save(): void {
    return;
  }
  export(): void {
    return;
  }

  addCanvas(canvas: Canvas): void {
    this.canvasList.push(canvas);
  }
}

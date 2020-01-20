import { ChangePrimaryColor } from '../../services/command-manager/commands/change-primary-color-command';
import { ChangeSecondaryColor } from '../../services/command-manager/commands/change-secondary-color-command';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { ShapeAbs } from './shape-abs';
import { SimpleShape } from './simple-shape';

const APPLYCOLOR = 'apply-color';

export class Shape extends ShapeAbs {
  color: Color;
  strokeWidth: number;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    origin: Point,
    size: Point,
    strokeWidth: number,
    angle = 0,
  ) {
    super(shapeDependency, htmlElement, origin, size, angle);
    this.color = color;
    this.strokeWidth = strokeWidth;
  }
  get colorData(): string {
    return this.color.hex;
  }
  changePrimaryColor(color: Color): Color {
    const oldColor: Color = this.color;
    this.color = color;
    this.setRenderer(this.htmlElement, [
      ['stroke', this.colorData],
      ['stroke-opacity', this.color.a.toString()],
    ]);
    return oldColor;
  }

  setListener(): void {
    this.renderer.listen(this.htmlElement, 'click', ($event: MouseEvent) => {
      $event.stopPropagation();
      $event.preventDefault();
      if (this.activeToolTitle === APPLYCOLOR) {
        const command: ChangePrimaryColor = new ChangePrimaryColor(
          this,
          this.primaryColor,
        );
        this.commandManager.addCommand(command);
        command.execute();
      }
    });

    this.renderer.listen(
      this.htmlElement,
      'contextmenu',
      ($event: MouseEvent) => {
        $event.stopPropagation();
        $event.preventDefault();
        if (this.activeToolTitle === APPLYCOLOR) {
          const command: ChangeSecondaryColor = new ChangeSecondaryColor(
            this,
            this.secondaryColor,
          );
          this.commandManager.addCommand(command);
          command.execute();
        }
      },
    );
  }

  showRedSquare(): void {
    this.redSquare = this.renderer.createElement('rect', 'svg');
    this.setRenderer(this.redSquare, [
      ['x', (-this.strokeWidth / 2).toString()],
      ['y', (-this.strokeWidth / 2).toString()],
      ['width', (this.size.x + this.strokeWidth).toString()],
      ['height', (this.size.y + this.strokeWidth).toString()],
      ['fill', 'none'],
      ['stroke', 'red'],
      ['stroke-width', '5'],
      ['vector-effect', 'non-scaling-stroke'],
      ['transform', this.transform],
    ]);
    this.renderer.appendChild(this.svgG, this.redSquare);
    this.redSquareDrawn = true;
  }

  get simplify(): SimpleShape {
    return {
      shapeExportName: 'Shape',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      transformMatrix: this.transformMatrix,
    };
  }
}

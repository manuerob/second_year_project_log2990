import { APPLYCOLOR, ERASER } from '../../../../../../common/constants/constants';
import { ChangePrimaryColor } from '../../services/command-manager/commands/change-primary-color-command';
import { ChangeSecondaryColor } from '../../services/command-manager/commands/change-secondary-color-command';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Point } from '../type';
import { Shape } from './shape';
import { ShapeAbs } from './shape-abs';
import { SimpleGeometric } from './simple-shape';

// tslint:disable-next-line: no-any
declare var require: any;
// tslint:disable-next-line:no-require-imports no-var-requires typedef naming-convention
const { Intersection, IntersectionQuery } = require('kld-intersections');
const INTERSECTION = 'Intersection';

export class Geometric extends Shape {
  outColor: Color;
  plotType: string;
  constructor(
    shapeDependency: ShapeDependencyService,
    htmlElement: SVGGraphicsElement,
    color: Color,
    outColor: Color,
    origin: Point,
    size: Point,
    strokeWidth: number,
    plotType: string,
    angle = 0,
  ) {
    super(
      shapeDependency,
      htmlElement,
      color,
      origin,
      size,
      strokeWidth,
      angle,
    );
    this.outColor = outColor;
    this.plotType = plotType;
    this.selected = false;
  }

  render(): void {
    this.updateRender();
    this.append();
  }

  updateRender(): void {
    this.setRenderer(this.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['width', this.size.x.toString()],
      ['height', this.size.y.toString()],
      ['fill', this.colorData],
      ['fill-opacity', this.color.a.toString()],
      ['stroke', this.outColorData],
      ['stroke-opacity', this.outColor.a.toString()],
      ['stroke-width', this.strokeWidth.toString()],
      ['transform', this.transform],
      ['vector-effect', 'non-scaling-stroke'],
    ]);
  }

  internCollid(point: Point): boolean {
    return IntersectionQuery.pointInPolygon(point, this.shapeInfo.args[0]);
  }

  collid(shape: ShapeAbs): boolean {
    return (
      Intersection.intersect(this.shapeInfo, shape.shapeInfo).status ===
        INTERSECTION ||
      (this.internCollid(shape.middleCentre) && this.plotType !== 'Outline') ||
      shape.internCollid(this.middleCentre)
    );
  }

  get outColorData(): string {
    return this.plotType === 'FullWithoutOutline' ? 'none' : this.outColor.hex;
  }
  get colorData(): string {
    return this.plotType === 'Outline' ? 'none' : this.color.hex;
  }
  changePrimaryColor(color: Color): Color {
    const oldColor: Color = this.color;
    this.color = color;
    this.setRenderer(this.htmlElement, [
      ['fill', this.colorData],
      ['fill-opacity', this.color.a.toString()],
    ]);
    return oldColor;
  }
  changeSecondaryColor(color: Color): Color {
    const oldColor: Color = this.outColor;
    this.outColor = color;
    this.setRenderer(this.htmlElement, [
      ['stroke', this.outColorData],
      ['stroke-opacity', this.outColor.a.toString()],
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

    this.renderer.listen(
      this.htmlElement,
      'mouseenter',
      ($event: MouseEvent) => {
        if (this.activeToolTitle === ERASER) {
          this.showRedSquare();
        }
      },
    );

    this.renderer.listen(
      this.htmlElement,
      'mouseleave',
      ($event: MouseEvent) => {
        if (this.activeToolTitle === ERASER) {
          this.removeRedSquare();
        }
      },
    );

    this.renderer.listen(
      this.htmlElement,
      'mousedown',
      ($event: MouseEvent) => {
        if ($event.buttons === 1) {
          if (this.activeToolTitle === ERASER) {
            this.selected = true;
          }
        }
      },
    );
  }
  get simplify(): SimpleGeometric {
    return {
      shapeExportName: 'Geometric',
      htmlElement: this.htmlElement,
      svgG: this.svgG,
      id: this.id,
      origin: this.origin,
      size: this.size,
      angle: this.angle,
      color: this.color,
      strokeWidth: this.strokeWidth,
      outColor: this.outColor,
      plotType: this.plotType,
      transformMatrix: this.transformMatrix,
    };
  }
}

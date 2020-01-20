import { Injectable, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { Attributs } from 'src/app/core/models/attributs';
import { IShapeHandler } from 'src/app/core/models/i-shape-handler';
import { TextObject } from 'src/app/core/models/shapes/text-object';
import {
  LAST_ELEMENT,
  MIN_LENGTH,
  SIZE_AJUST,
  WORD_START,
} from '../../../../../../../common/constants/constants';
import {
  KEY_0,
  KEY_BACK_SPACE,
  KEY_DIVIDE,
  KEY_NUMPAD0,
  KEY_QUOTE,
  KEY_RETURN,
  KEY_SEMI_COLON,
  KEY_SPACE,
  KEY_Z,
} from '../../../../../../../common/constants/key-code';
import { CreateCommand } from '../../command-manager/commands/create-command';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from './../shape-handler/shape-handler.service';
@Injectable({
  providedIn: 'root',
})
export class TextHandlerService extends ShapeHandlerService
  implements IShapeHandler {
  shape: TextObject;
  renderer: Renderer2;
  squareRef: SVGGraphicsElement;
  constructor(
    shapeDependency: ShapeDependencyService,
    attributsService: AttributsService,
    savedDrawing: SaveDrawingService,
    hotkeyManager: HotkeyManagerService,
    protected sanitizer: DomSanitizer,
  ) {
    super(shapeDependency, attributsService, savedDrawing, hotkeyManager);
    this.subscriptions.push(
      this.attributsService.attributs$.subscribe((attributs: Attributs) => {
        this.setParams();
      }),
    );
  }
  onMouseDown(event: MouseEvent): void {
    if (!this.drawingService.isDrawing) {
      this.hotkeyManager.available = false;
      this.startingPoint = { x: event.layerX, y: event.layerY };
      this.drawingService.isDrawing = true;
      const classStyle = `
        font: ${this.attributs.mutator} ${this.attributs.fontSize}px ${this.attributs.font}; stroke-fill: #031;`;
      this.newShape();
      this.squareRef = this.renderer.createElement('rect', 'svg');
      this.setRenderer(this.squareRef, [
        ['x', (-this.attributs.fontSize).toString()],
        ['y', (-this.attributs.fontSize).toString()],
        ['width', (SIZE_AJUST * this.attributs.fontSize).toString()],
        ['height', (SIZE_AJUST * this.attributs.fontSize).toString()],
        ['fill', '#4A4A4A'],
        ['fill-opacity', '0.2'],
        ['stroke', '#4A4A4A'],
        ['stroke-width', '1'],
        ['transform', this.shape.transform],
      ]);
      this.shape.tspans.push(this.renderer.createElement('tspan', 'svg'));
      this.shape.padding = this.attributs.fontSize;
      this.setRenderer(this.shape.tspans[0], [
        ['text-anchor', this.attributs.alignmentType],
      ]);
      this.renderer.setAttribute(this.shape.htmlElement, 'style', classStyle);
      const text: SVGGraphicsElement = this.renderer.createText('');
      this.shape.render();
      this.renderer.appendChild(
        this.shape.tspans[this.shape.currentSpanCount],
        text,
      );
      this.renderer.appendChild(
        this.shape.htmlElement,
        this.shape.tspans[this.shape.currentSpanCount],
      );
      this.renderer.appendChild(this.shape.svgG, this.squareRef);
    } else {
      this.endShape();
    }
  }

  newShape(): void {
    this.shape = new TextObject(
      this.shapeDependency,
      this.renderer.createElement('text', 'svg'),
      this.startingPoint,
      { x: 0, y: 0 },
      this.primaryColor,
      this.attributs.mutator,
      this.attributs.font,
      this.attributs.fontSize,
      this.attributs.alignmentType,
    );
  }

  rectifyPosition(): void {
    /* tslint:disable:no-any */
    const bbox: any = this.shape.htmlElement.getBBox();
    this.shape.size.x = bbox.width;
    this.shape.size.y = bbox.height;
    this.setRenderer(this.shape.htmlElement, [
      ['x', '0'],
      ['y', '0'],
      ['transform', this.shape.transform],
    ]);
    for (const tspan of this.shape.tspans) {
      this.setRenderer(tspan, [
        ['text-anchor', this.shape.alignment],
        ['dy', this.shape.fontSize.toString()],
        ['x', '0'],
      ]);
    }
  }

  setParams(): void {
    if (this.shape) {
      this.shape.alignment = this.attributs.alignmentType;
      this.shape.fontSize = this.attributs.fontSize;
      this.rectifyPosition();
      const classStyle = `
        font: ${this.attributs.mutator} ${this.attributs.fontSize}px ${this.attributs.font}; stroke-fill: #031;`;
      this.renderer.setAttribute(this.shape.htmlElement, 'style', classStyle);
      this.shape.mutator = this.attributs.mutator;
      this.shape.fontSize = this.attributs.fontSize;
      this.shape.font = this.attributs.font;
      this.updateBorderRect();
      this.rectifyPosition();
    }
  }

  removeSpan(tspan: SVGGraphicsElement): void {
    this.renderer.removeChild(this.shape.htmlElement, tspan);
    this.shape.tspanValues.pop();
    this.shape.tspans.pop();
    this.shape.currentSpanCount--;
  }

  onBackspace(): void {
    if (this.drawingService.isDrawing) {
      if (this.shape.tspanValues.length > MIN_LENGTH) {
        this.shape.tspanValues[
          this.shape.currentSpanCount
        ] = this.shape.tspanValues[this.shape.currentSpanCount].substring(
          WORD_START,
          this.shape.tspanValues[this.shape.currentSpanCount].length -
            LAST_ELEMENT,
        );

        this.shape.tspanValues[this.shape.currentSpanCount] === ''
          ? this.removeSpan(this.shape.tspans[this.shape.currentSpanCount])
          : this.renderer.setProperty(
              this.shape.tspans[this.shape.currentSpanCount],
              'innerHTML',
              this.shape.tspanValues[this.shape.currentSpanCount],
            );

        this.rectifyPosition();
        this.updateBorderRect();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
     // tslint:disable-next-line: deprecation
    const keyCode: number = event.keyCode;
    if (this.drawingService.isDrawing) {
      if (
        keyCode !== KEY_BACK_SPACE &&
        ((KEY_0 <= keyCode && keyCode <= KEY_Z) ||
          (KEY_NUMPAD0 <= keyCode && keyCode <= KEY_DIVIDE) ||
          (KEY_SEMI_COLON <= keyCode && keyCode <= KEY_QUOTE) ||
          keyCode === KEY_SPACE)
      ) {
        this.shape.tspanValues[this.shape.currentSpanCount] += event.key;
        this.renderer.setProperty(
          this.shape.tspans[this.shape.currentSpanCount],
          'innerHTML',
          this.shape.tspanValues[this.shape.currentSpanCount],
        );
        this.rectifyPosition();
        this.updateBorderRect();
        this.setRenderer(this.shape.tspans[this.shape.currentSpanCount], [
          ['dy', this.attributs.fontSize.toString()],
          ['x', '0'],
        ]);
      } else if (keyCode === KEY_RETURN) {
        this.newLine();
        this.rectifyPosition();
        this.updateBorderRect();
        this.setRenderer(this.shape.tspans[this.shape.currentSpanCount], [
          ['dy', this.attributs.fontSize.toString()],
          ['x', '0'],
          ['text-anchor', this.shape.alignment],
        ]);
      }
    }
  }

  updateBorderRect(): void {
    /* tslint:disable:no-any */
    const bbox: any = this.shape.htmlElement.getBBox();
    this.setRenderer(this.squareRef, [
      ['x', (bbox.x - this.shape.padding / SIZE_AJUST).toString()],
      ['y', (bbox.y - this.shape.padding / SIZE_AJUST).toString()],
      ['width', (bbox.width + this.shape.padding).toString()],
      ['height', (bbox.height + this.shape.padding).toString()],
      ['transform', this.shape.transform],
    ]);
  }

  newLine(): void {
    this.shape.tspans.push(this.renderer.createElement('tspan', 'svg'));
    this.shape.tspanValues.push('');
    this.shape.currentSpanCount++;
    this.renderer.setAttribute(
      this.shape.tspans[this.shape.currentSpanCount],
      'text-anchor',
      this.attributs.alignmentType,
    );
    this.renderer.appendChild(
      this.shape.htmlElement,
      this.shape.tspans[this.shape.currentSpanCount],
    );
  }

  reset(): void {
    if (this.drawingService.isDrawing) {
      this.endShape();
    }
  }

  endShape(): void {
    this.hotkeyManager.available = true;
    this.drawingService.isDrawing = false;
    this.renderer.removeChild(this.shape.svgG, this.squareRef);
    this.rectifyPosition();
    this.shape.alignment = this.attributs.alignmentType;
    this.commandManager.addCommand(new CreateCommand(this.shape));
    this.savedDrawing.updateSavedImage();
    this.newShape();
  }
}

import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { FAKE_ATTRIBUTS } from 'src/app/core/mocks/fake-attributs';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { TextHandlerService } from 'src/app/core/services/shape-service/text-handler/text-handler.service';
import { SaveDrawingService } from '../../../../components/save-drawing/service/save-drawing.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

describe('TextHandlerService', () => {
  let service: TextHandlerService;
  let fakeDrawingService: DrawingService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        TextHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
        HttpClient,
        HttpHandler,
      ],
    }),
  );
  beforeEach(() => {
    service = TestBed.get(TextHandlerService);
    fakeDrawingService = TestBed.get(DrawingService);
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Create the text on mouseDown while not drawing', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.attributs.mutator = 'italic';
    service.onMouseDown(event);
    expect(service.shape.tspans.length).toBe(1);
    expect(service.shape.tspanValues[0]).toEqual('');
    expect(service.shape.size).toEqual({
      x: 0,
      y: 0,
    });
    expect(service.startingPoint).toEqual({ x: 5, y: 129 });
  });

  it('should create new tspan on newLine', () => {
    const event: MouseEvent = new MouseEvent('mouseDown');
    spyOnProperty(event, 'layerX').and.returnValue(5);
    spyOnProperty(event, 'layerY').and.returnValue(129);
    fakeDrawingService.isDrawing = false;
    service.attributs = FAKE_ATTRIBUTS;
    service.attributs.mutator = 'italic';
    service.onMouseDown(event);
    service.shape.tspans.length = 1;
    service.shape.tspanValues[0] = 'b';
    service.newLine();
    expect(service.shape.tspans.length).toEqual(2);
    expect(service.shape.tspanValues[1]).toBe('');
  });

  it('should end shape on reset call', () => {
    service.drawingService.isDrawing = true;
    const spy: jasmine.Spy<() => void> = spyOn(service, 'endShape');
    service.reset();
    expect(spy).toHaveBeenCalled();
  });
});

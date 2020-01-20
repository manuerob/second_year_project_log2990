import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from './../../shape-dependency/shape-dependency.service';
import { ShapeHandlerService } from './shape-handler.service';

describe('ShapeHandlerService', () => {
  let service: ShapeHandlerService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
providers: [
        ShapeDependencyService,
        { provide: MatDialogRef, useValue: {} },
        ShapeHandlerService,
        Renderer2,
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
    service = TestBed.get(ShapeHandlerService);
    service.canvasRef = { nativeElement: 'any' };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('change shift value on shift press', () => {
    service.isShiftDown = (undefined as unknown) as boolean;
    service.onShiftDown(true);
    expect(service.isShiftDown).toBeDefined();
  });
});

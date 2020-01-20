import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { ColorService } from '../color/color.service';
import { CommandManagerService } from '../command-manager/command-manager.service';
import { DrawingService } from '../drawing/drawing.service';
import { ShapeComposite } from './../../models/shapes/shape-composite';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockRendererFactory } from '../../mocks/fake-renderer-factory.mock';
import { MockRenderer } from '../../mocks/fake-renderer.mock';
import { ShapeDependencyService } from '../shape-dependency/shape-dependency.service';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let fakeShapeDepedency: ShapeDependencyService;
  let newShapeComposite: ShapeComposite;
  let service: ClipboardService;
  let rendererFactory: RendererFactory2;
  let renderer: Renderer2;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ShapeDependencyService,
        { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ColorService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        CommandManagerService,
      ],
    }),
  );

  beforeEach(() => {
    service = TestBed.get(ClipboardService);
    rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);
    fakeShapeDepedency = TestBed.get(ShapeDependencyService);

    newShapeComposite = new ShapeComposite(
      fakeShapeDepedency,
      renderer.createElement('rect', 'svg'),
      { x: 3, y: 0 },
      { x: 3, y: 0 },
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the right shapeComposite', () => {
    const revalue = service.shapeComposite;
    expect(revalue.center).toEqual({ x: 0, y: 0 });
  });

  it('should return the new right shapeComposite', () => {
    service.shapeComposite = newShapeComposite;
    service.shapeComposite$.subscribe((newshape) => {
      expect(newshape.size).toEqual({ x: 3, y: 0 });
    });
  });
});

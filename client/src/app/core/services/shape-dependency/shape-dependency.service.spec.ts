import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RendererFactory2 } from '@angular/core';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { ColorService } from '../color/color.service';
import { CommandManagerService } from '../command-manager/command-manager.service';
import { DrawingService } from '../drawing/drawing.service';
import { ShapeDependencyService } from './shape-dependency.service';

describe('ShapeDependencyService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DrawingService,
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ToolService,
        CommandManagerService,
        DisplayShapesService,
        ColorService,
      ],
    }),
  );

  it('should be created', () => {
    const service: ShapeDependencyService = TestBed.get(ShapeDependencyService);
    expect(service).toBeTruthy();
  });
});

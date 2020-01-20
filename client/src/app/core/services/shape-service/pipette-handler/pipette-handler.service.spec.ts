import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { ApiService } from '../../api/api.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { PipetteHandlerService } from './pipette-handler.service';

// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

const PRIMARYCOLOR: Color = new Color('#006600');
const SECONDARYCOLOR: Color = new Color('#999999');

describe('PipetteHandlerService', () => {
  let service: PipetteHandlerService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        PipetteHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
        ApiService,
      ],
      imports: [HttpClientTestingModule, MatDialogModule],
    }),
  );

  beforeEach(() => {
    service = TestBed.get(PipetteHandlerService);
    /* tslint:disable:max-line-length */
    service.canvasRef = {
      nativeElement:
        '<svg xmlns="http://www.w3.org/2000/svg" _ngcontent-agy-c2="" style="width: 3px; height: 3px;"> <rect _ngcontent-agy-c2="" height="100%" width="100%" style="fill: rgb(255, 255, 255);" /> <g _ngcontent-agy-c0=""> <polyline _ngcontent-agy-c0="" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#4ed053" stroke-width="12" stroke-opacity="1" points="0,0 0,0 " transform="translate(0, 0) rotate(0)" /> </g> <g _ngcontent-agy-c0=""> <polyline _ngcontent-agy-c0="" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#4ed053" stroke-width="12" stroke-opacity="1" points="0,0 0,0 " transform="translate(1, 0) rotate(0)" /> </g></svg>',
    };
    service.primaryColor = PRIMARYCOLOR;
    service.secondaryColor = SECONDARYCOLOR;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

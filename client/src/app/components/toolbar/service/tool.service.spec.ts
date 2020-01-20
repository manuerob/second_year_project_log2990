import { TestBed } from '@angular/core/testing';

import { RectangleControlsComponent } from 'src/app/components/attributs/controls/rectangle-controls/rectangle-controls.component';
import { RectangleHandlerService } from 'src/app/core/services/shape-service/rectangle-handler/rectangle-handler.service';
import RegularCommandTool from '../../../core/models/regular-command-tool';
import { Tool } from '../../../core/models/tool';
import { ToolService } from './tool.service';

describe('ToolService', () => {
  let service: ToolService;
  const rectangleTool: Tool = {
    title: 'rectangle',
    command: new RegularCommandTool('rectangle'),

    button: {
      helperText: 'rectangle',
      helperMp4: 'a video',
      iconName: 'rectangle',
      managerButton: false,
    },
    controlsComponent: RectangleControlsComponent,
    service: RectangleHandlerService,
  };
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(ToolService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return rectangle as the activeTool', (done: DoneFn) => {
    service.activeTool = rectangleTool;
    service.activeTool$.subscribe((activeTool: Tool) => {
      expect(activeTool.title).toEqual('rectangle');
      done();
    });
  });
});

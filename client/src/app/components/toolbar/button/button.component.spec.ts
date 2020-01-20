import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from './button.component';

import { Tool } from 'src/app/core/models/tool';
import { ToolService } from './../service/tool.service';

import RegularCommandTool from 'src/app/core/models/regular-command-tool';
import { RectangleControlsComponent } from '../../attributs/controls/rectangle-controls/rectangle-controls.component';
import { RectangleHandlerService } from './../../../core/services/shape-service/rectangle-handler/rectangle-handler.service';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let toolService: ToolService;
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [MatDialogModule],
      providers: [ToolService, { provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    toolService = TestBed.get(ToolService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be de defautlt values', () => {
    expect(component.showChildren).not.toBeTruthy();
    expect(component.showHelper).not.toBeTruthy();
    expect(component.manager).not.toBeTruthy();
  });

  it('should have received the right value', () => {
    toolService.activeTool = rectangleTool;
    expect(component.activeToolTitle).toEqual('rectangle');
  });

  it('should have return true if same tool', () => {
    component.activeToolTitle = 'rectangle';
    component.tool = rectangleTool;
    expect(component.isActive()).toBeTruthy();
  });
  it('should have return false if different tool', () => {
    component.activeToolTitle = 'salade';
    component.tool = rectangleTool;
    expect(component.isActive()).not.toBeTruthy();
  });

  it('should have changed showChildren value', () => {
    component.ngOnInit();
    component.tool = rectangleTool;
    component.manager = false;
    component.tool.button.children = [rectangleTool];
    component.showChildren = true;
    const event: MouseEvent = new MouseEvent('click');
    component.onClick(event);
    expect(component.showChildren).not.toBeTruthy();
  });
});

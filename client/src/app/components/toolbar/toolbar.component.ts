import { Component, HostListener, OnInit } from '@angular/core';
import AdminTool from 'src/app/core/models/admin-tool';
import { Tool } from 'src/app/core/models/tool';
import { SnappingService } from 'src/app/core/services/shape-service/select-handler/snapping/snapping.service';
import { ToolAbs } from '../../core/models/tool-abs';
import { GridService } from '../canvas/grid/grid.service';
import { HotkeyManagerService } from './../../core/services/hotkey/hotkey-manager.service';
import { CustomModalService } from './../../core/services/modal/custom-modal.service';
import {
  COLORS_TOOLS,
  ColorsEnum,
  FORMS_TOOLS,
  FormsEnum,
  LINES_TOOLS,
  LinesEnum,
  SettingsEnum,
  TOOLS,
  ToolsEnum,
} from './data';
import { ToolService } from './service/tool.service';
import { SETTINGS_TOOLS } from './tools';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  tools: ToolAbs[];
  managerTools: ToolAbs[];

  constructor(
    private gridService: GridService,
    private tool: ToolService,
    private modal: CustomModalService,
    private hotkeys: HotkeyManagerService,
    private snappingService: SnappingService,
  ) {
    this.tool.activeTool = TOOLS[0];
  }

  ngOnInit(): void {
    this.tools = TOOLS.filter((tool: Tool) => !tool.button.managerButton);
    this.managerTools = TOOLS.filter((tool: AdminTool) => tool.button.managerButton);
  }

  @HostListener('document:keydown.control.o', ['$event'])
  newDrawing($event: KeyboardEvent): void {
    $event.preventDefault();
    if (!this.modal.isModalOpen) {
      this.resetTool();
      this.modal.open((SETTINGS_TOOLS[SettingsEnum.NEWCANVAS] as AdminTool).modalComponent);
    }
  }

  @HostListener('document:keydown.control.g', ['$event'])
  editFile($event: KeyboardEvent): void {
    $event.preventDefault();
    if (!this.modal.isModalOpen) {
      this.resetTool();
      this.modal.open((SETTINGS_TOOLS[SettingsEnum.EDIT] as AdminTool).modalComponent);
    }
  }

  resetTool(): void {
    this.tool.activeTool = TOOLS[ToolsEnum.SELECT];
  }

  @HostListener('document:keydown.control.s', ['$event'])
  saveFile($event: KeyboardEvent): void {
    $event.preventDefault();
    if (this.hotkeys.isAvailable()) {
      this.resetTool();
      this.modal.open((SETTINGS_TOOLS[SettingsEnum.SAVE] as AdminTool).modalComponent);
    }
  }

  @HostListener('document:keydown.control.e', ['$event'])
  exportFile($event: MouseEvent): void {
    $event.preventDefault();
    if (this.hotkeys.isAvailable()) {
      this.resetTool();
      this.modal.open((SETTINGS_TOOLS[SettingsEnum.EXPORT] as AdminTool).modalComponent);
    }
  }

  @HostListener('document:keydown.g', ['$event'])
  setGridVisibility($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.gridService.toggleShowGrid(!this.gridService.showGrid);
    }
  }

  @HostListener('document:keydown.m', ['$event'])
  setMagnetism($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.snappingService.toggleActiveSnapping(!this.snappingService.showSnapping);
    }
  }

  @HostListener('document:keydown.c', ['$event'])
  setPencilTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = LINES_TOOLS[LinesEnum.PENCIL];
    }
  }

  @HostListener('document:keydown.p', ['$event'])
  setFeatherTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = LINES_TOOLS[LinesEnum.FEATHER];
    }
  }

  @HostListener('document:keydown.a', ['$event'])
  setSpraypaintTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = LINES_TOOLS[LinesEnum.SPRAYPAINT];
    }
  }

  @HostListener('document:keydown.s', ['$event'])
  setSelectTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = TOOLS[ToolsEnum.SELECT];
    }
  }

  @HostListener('document:keydown.r', ['$event'])
  setApplyColorTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = COLORS_TOOLS[ColorsEnum.APPLYCOLOR];
    }
  }

  @HostListener('document:keydown.3', ['$event'])
  setPolygonTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = FORMS_TOOLS[FormsEnum.POLYGON];
    }
  }

  @HostListener('document:keydown.2', ['$event'])
  setCircleTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = FORMS_TOOLS[FormsEnum.CIRCLE];
    }
  }

  @HostListener('document:keydown.1', ['$event'])
  setRectangleTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = FORMS_TOOLS[FormsEnum.RECTANGLE];
    }
  }

  @HostListener('document:keydown.l', ['$event'])
  setLineTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = LINES_TOOLS[LinesEnum.LINE];
    }
  }

  @HostListener('document:keydown.t', ['$event'])
  setTextTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = TOOLS[ToolsEnum.TEXT];
    }
  }

  @HostListener('document:keydown.w', ['$event'])
  setBrushTool($event: MouseEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = LINES_TOOLS[LinesEnum.BRUSH];
    }
  }

  @HostListener('document:keydown.y', ['$event'])
  setPenTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = LINES_TOOLS[LinesEnum.PEN];
    }
  }

  @HostListener('document:keydown.e', ['$event'])
  setEraserTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = TOOLS[ToolsEnum.ERASER];
    }
  }

  @HostListener('document:keydown.b', ['$event'])
  setBucketTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = COLORS_TOOLS[ColorsEnum.BUCKET];
    }
  }

  @HostListener('document:keydown.i', ['$event'])
  setPipetteTool($event: KeyboardEvent): void {
    if (this.hotkeys.isAvailable()) {
      $event.preventDefault();
      this.tool.activeTool = COLORS_TOOLS[ColorsEnum.PIPETTE];
    }
  }
}

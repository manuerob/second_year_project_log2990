import { Component, Input, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import AdminTool from 'src/app/core/models/admin-tool';
import { ToolAbs } from 'src/app/core/models/tool-abs';
import { Tool } from '../../../core/models/tool';
import { TOOLS, ToolsEnum } from '../data';
import { ASSET_PATH } from './../../../../../../common/constants/constants';
import { CustomModalService } from './../../../core/services/modal/custom-modal.service';
import { ToolService } from './../service/tool.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent extends AbstractSubscriptions implements OnInit {
  @Input() tool: Tool | AdminTool;
  @Input() manager: boolean;
  showChildren: boolean;
  parent: boolean;
  showHelper: boolean;
  activeToolTitle: string;

  constructor(
    private toolService: ToolService,
    private modal: CustomModalService,
  ) {
    super();
    this.showChildren = false;
    this.showHelper = false;
    this.manager = false;
    this.parent = false;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.toolService.activeTool$.subscribe((activeTool: ToolAbs) => {
        this.activeToolTitle = activeTool.title;
      }),
    );
  }

  get path(): string {
    return this.tool ? ASSET_PATH + this.tool.button.helperMp4 : '';
  }

  onClick($event: MouseEvent): void {
    $event.stopPropagation();
    if (this.manager) {
      this.toolService.activeTool = TOOLS[ToolsEnum.SELECT];
      this.modal.open(
        (this.tool as AdminTool).modalComponent,
        (this.tool as AdminTool).modalConfig,
      );
    } else if (this.tool.button.children) {
      this.showChildren = !this.showChildren;
    } else {
      this.toolService.activeTool = this.tool;
    }
  }

  isChildActive(): boolean {
    if (this.tool.button.children) {
      for (const child of this.tool.button.children) {
        if (child.title === this.activeToolTitle) {
          return true;
        }
      }
    }
    return false;
  }

  onMouseEnter(): void {
    if (this.tool.button.children) {
      this.showChildren = true;
    }
  }

  onMouseLeave(): void {
    if (this.tool.button.children) {
      this.showChildren = false;
    }
  }

  isActive(): boolean {
    return this.activeToolTitle === this.tool.title || this.isChildActive();
  }
}

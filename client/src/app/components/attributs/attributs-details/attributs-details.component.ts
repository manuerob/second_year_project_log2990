import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Tool } from '../../../core/models/tool';
import { AbstractSubscriptions } from './../../../core/helper/class/abstract-subscriptions';
import { ColorPickerService } from './../../color-picker/color-picker.service';
import { ToolService } from './../../toolbar/service/tool.service';

@Component({
  selector: 'app-attributs-details',
  templateUrl: './attributs-details.component.html',
  styleUrls: ['./attributs-details.component.scss'],
})
export class AttributsDetailsComponent extends AbstractSubscriptions implements OnInit {
  isClicked: boolean;
  // tslint:disable-next-line: no-any
  controlsComponent: Type<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  constructor(
    private toolService: ToolService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private colorPicker: ColorPickerService,
  ) {
    super();
    this.isClicked = false;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.toolService.activeTool$.subscribe((activeTool: Tool) => {
        this.controlsComponent = activeTool.controlsComponent;
        if (this.colorPicker.isShown) {
          this.colorPicker.hide();
        }
        this.loadComponent();
      }),
    );
  }

  loadComponent(): void {
    const componentFactory: ComponentFactory<
      // tslint:disable-next-line: no-any
      any
    > = this.componentFactoryResolver.resolveComponentFactory(this.controlsComponent);

    this.container.clear();

    this.container.createComponent(componentFactory);
  }
}

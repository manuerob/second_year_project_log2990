import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from 'src/app/core/models/attributs';
import { AttributsService } from '../../attributs.service';

@Component({
  selector: 'app-line-controls',
  templateUrl: './line-controls.component.html',
  styleUrls: ['./line-controls.component.scss'],
})
export class LineControlsComponent extends AbstractSubscriptions implements OnInit {
  selected: string;
  width: number;
  linePatterns: Map<string, string>;
  junctionTypes: Map<string, string>;
  currentLinePattern: string;
  currentJunctionType: string;
  pointJointDiameter: number;

  constructor(private attributsService: AttributsService) {
    super();
    this.linePatterns = attributsService.linePatterns;
    this.junctionTypes = attributsService.junctionTypes;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.attributsService.attributs$.subscribe((attributs: Attributs) => {
      this.width = attributs.width;
      this.currentJunctionType = attributs.junctionType;
      this.currentLinePattern = attributs.linePattern;
      this.pointJointDiameter = attributs.pointJointDiameter;
    }), );
  }

  onWidthChange(newValue: number): void {
    this.attributsService.attributs.width = newValue;
  }

  onJointDiameterChange(newValue: number): void {
    this.attributsService.attributs.pointJointDiameter = newValue;
  }

  onlinePatternChange(newValue: string): void {
    this.attributsService.attributs.linePattern = newValue;
  }
  onJunctionTypeChange(newValue: string): void {
    this.attributsService.attributs.junctionType = newValue;
  }
}

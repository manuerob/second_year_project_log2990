import { Component, OnInit } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Attributs } from '../../../../core/models/attributs';
import { AttributsService } from '../../attributs.service';

@Component({
  selector: 'app-text-controls',
  templateUrl: './text-controls.component.html',
  styleUrls: ['./text-controls.component.scss'],
})
export class TextControlsComponent extends AbstractSubscriptions implements OnInit {
  alignmentTypes: Map<string, string>;
  currentAlignmentType: string;
  mutators: Map<string, string>;
  currentMutator: string;
  fontSize: number;
  fonts: Map<string, string>;
  currentFont: string;

  constructor(private attributsService: AttributsService) {
    super();
    this.alignmentTypes = attributsService.alignmentTypes;
    this.mutators = attributsService.mutators;
    this.fonts = attributsService.fonts;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.attributsService.attributs$.subscribe(
      (attributs: Attributs) => {
        this.fontSize = attributs.fontSize;
        this.currentFont = attributs.font;
        this.currentMutator = attributs.mutator;
        this.currentAlignmentType = attributs.alignmentType;
      },
    ));

  }

  onFontSizeChange(newValue: number): void {
    this.attributsService.changeFontSize(newValue);
  }

  onAlignTypeChange(newValue: string): void {
    this.attributsService.changeAlignType(newValue);
  }

  onMutatorChange(newValue: string): void {
    this.attributsService.changeMutator(newValue);
  }

  onFontChange(newValue: string): void {
    this.attributsService.changeFont(newValue);
  }
}

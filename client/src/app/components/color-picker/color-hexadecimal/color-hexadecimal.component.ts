import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColorService } from 'src/app/core/services/color/color.service';
import {
  BLUE_COLOR_INDEX,
  GREEN_COLOR_INDEX,
  NUMBER_OF_CHARACTERS,
  RED_COLOR_INDEX,
  STRING_RADIX_NUM,
} from '../../../../../../common/constants/constants';
import { Color } from '../../../core/models/color';

/* tslint:disable:no-magic-numbers */

@Component({
  selector: 'app-color-hexadecimal',
  templateUrl: './color-hexadecimal.component.html',
  styleUrls: ['./color-hexadecimal.component.scss'],
})
export class ColorHexadecimalComponent implements OnInit {
  @Input() rgba: Color;
  @Input() form: FormGroup;
  submitted: boolean;

  constructor(private colorService: ColorService) {
    this.rgba = this.colorService.primaryColor.copy();
    this.submitted = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      hexadecimalCode: new FormControl(
        this.rgba.hex,
        Validators.compose([
          Validators.required,
          Validators.pattern('^#(?:[0-9a-fA-F]{3}){1,2}$'),
        ]),
      ),
    });
  }

  onSubmit(): void {
    // tslint:disable-next-line: no-any
    let value: any = this.form.controls.hexadecimalCode.value;
    this.submitted = true;

    if (
      this.form.invalid ||
      value.length <= 3 ||
      value.length >= 8 ||
      value[0] !== '#'
    ) {
      return;
    } else {
      if (value.length === 4) {
        // tslint:disable-next-line: no-any
        const value2: any = value[0].concat(
          value[1],
          value[1],
          value[2],
          value[2],
          value[3],
          value[3],
        );
        value = value2;
      }
      this.rgba.r = parseInt(
        value.substr(RED_COLOR_INDEX, NUMBER_OF_CHARACTERS),
        STRING_RADIX_NUM,
      );
      this.rgba.g = parseInt(
        value.substr(GREEN_COLOR_INDEX, NUMBER_OF_CHARACTERS),
        STRING_RADIX_NUM,
      );
      this.rgba.b = parseInt(
        value.substr(BLUE_COLOR_INDEX, NUMBER_OF_CHARACTERS),
        STRING_RADIX_NUM,
      );
      this.rgba.hex = value;
    }
  }
}

import {
  BLUE_COLOR_INDEX,
  DEUX_PI,
  GREEN_COLOR_INDEX,
  MAX_ALPHA_NUM,
  MAX_COLOR_NUM,
  MAX_HEX_LENGTH,
  MIN_COLOR_NUM,
  MIN_HEX_LENGTH,
  NUMBER_OF_CHARACTERS,
  ONE_HUNDRED,
  RED_COLOR_INDEX,
  STRING_RADIX_NUM,
} from '../../../../../common/constants/constants';

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
  hsv: number;
  constructor(hex = '#fff') {
    this.a = MAX_ALPHA_NUM;
    this.hex = hex;

    this.convert2Hex();
    this.hsv = 0;
  }
  getHex(): string {
    return this.hex;
  }

  copy(): Color {
    const tempColor = new Color();

    tempColor.hex = this.hex;
    tempColor.r = this.r;
    tempColor.g = this.g;
    tempColor.b = this.b;
    tempColor.a = this.a;
    return tempColor;
  }

  getColorString(): string {
    return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }

  private num2hex(value: number): string {
    const valueString: string = value.toString(STRING_RADIX_NUM);
    if (value > MAX_COLOR_NUM || value < MIN_COLOR_NUM) {
      return '#000';
    }
    return valueString.length > 1 ? valueString : '0' + valueString;
  }

  rgb2hex(): string {
    return (
      '#' + this.num2hex(this.r) + this.num2hex(this.g) + this.num2hex(this.b)
    );
  }

  convert2Hex(): void {
    if (
      this.hex.length === MAX_HEX_LENGTH ||
      this.hex.length === MIN_HEX_LENGTH
    ) {
      if (this.hex.length === MIN_HEX_LENGTH) {
        // tslint:disable-next-line: no-any
        const tempHex = this.hex;
        const value = tempHex[0].concat(
          tempHex[1],
          tempHex[1],
          tempHex[2],
          tempHex[2],
          // tslint:disable-next-line: no-magic-numbers
          tempHex[3],
          // tslint:disable-next-line: no-magic-numbers
          tempHex[3],
        );
        this.hex = value;
      }
      this.r = parseInt(
        this.hex.substr(RED_COLOR_INDEX, NUMBER_OF_CHARACTERS),
        STRING_RADIX_NUM,
      );
      this.g = parseInt(
        this.hex.substr(GREEN_COLOR_INDEX, NUMBER_OF_CHARACTERS),
        STRING_RADIX_NUM,
      );
      this.b = parseInt(
        this.hex.substr(BLUE_COLOR_INDEX, NUMBER_OF_CHARACTERS),
        STRING_RADIX_NUM,
      );
    } else {
      this.r = MAX_COLOR_NUM;
      this.g = MAX_COLOR_NUM;
      this.b = MAX_COLOR_NUM;
    }
  }
  // Found online: Gives a value between 0 and 360, which is the position on the spectrum
  rgb2hsv(): void {
    // Make r, g, and b fractions of 1
    const r: number = this.r / MAX_COLOR_NUM;
    const g: number = this.g / MAX_COLOR_NUM;
    const b: number = this.b / MAX_COLOR_NUM;
    // Find greatest and smallest channel values
    const cmin: number = Math.min(r, g, b);
    const cmax: number = Math.max(r, g, b);
    const delta: number = cmax - cmin;

    /* tslint:disable:no-magic-numbers */

    const l: number = (cmax + cmin) / 2;
    let s: number = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * ONE_HUNDRED).toFixed(1);

    let h = 0;

    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    // Make negative hues positive behind 360°
    if (h < 0) {
      h += DEUX_PI;
    }
    s = s / ONE_HUNDRED;
    h = h / DEUX_PI;
    /* tslint:enable:no-magic-numbers */

    this.hsv = h;
  }

  compare(newColor: Color): boolean {
    if (
      newColor.r === this.r &&
      newColor.g === this.g &&
      newColor.b === this.b &&
      newColor.a === this.a
    ) {
      return true;
    } else {
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from 'src/app/core/models/color';
import { MAXIMUM_NUMBER_OF_COLOR } from '../../../../../common/constants/constants';
import { ColorService } from './../../core/services/color/color.service';

@Injectable({
  providedIn: 'root',
})
export class ColorPickerService {
  currentColorBase: string;
  private previousColorsSubject: BehaviorSubject<Color[]>;
  private showSubject: BehaviorSubject<boolean>;
  private colorSubject: BehaviorSubject<Color>;

  selectedPreviousColor: BehaviorSubject<Color>;
  selectedPreviousColor$: Observable<Color>;

  show$: Observable<boolean>;
  color$: Observable<Color>;
  maximunNumberOfColor: number;
  previousColors$: Observable<Color[]>;

  constructor(private colorService: ColorService) {
    this.currentColorBase = 'primary';
    this.previousColorsSubject = new BehaviorSubject<Color[]>([]);
    this.showSubject = new BehaviorSubject<boolean>(false);
    this.colorSubject = new BehaviorSubject<Color>(new Color('#000'));
    this.selectedPreviousColor = new BehaviorSubject<Color>(
      this.colorService.primaryColor.copy(),
    );
    this.selectedPreviousColor$ = this.selectedPreviousColor.asObservable();
    this.show$ = this.showSubject.asObservable();
    this.color$ = this.colorSubject.asObservable();
    this.previousColors$ = this.previousColorsSubject.asObservable();
  }

  get isShown(): boolean {
    return this.showSubject.getValue();
  }

  show(): void {
    this.showSubject.next(true);
  }

  get previousColors(): Color[] {
    return this.previousColorsSubject.getValue();
  }

  addNewPreviousColor(newColor: Color): void {
    if (!this.isInLastPreviousColors(newColor)) {
      if (this.previousColors.length >= MAXIMUM_NUMBER_OF_COLOR) {
        this.previousColors.splice(
          0,
          MAXIMUM_NUMBER_OF_COLOR - this.previousColors.length + 1,
        );
      }

      this.previousColorsSubject.getValue().push(newColor.copy());

      this.selectedPreviousColor.next(newColor.copy());
    }
  }

  isInLastPreviousColors(newColor: Color): boolean {
    const previousColors = this.previousColors;

    if (
      previousColors.length > 0 &&
      newColor.r === previousColors[previousColors.length - 1].r &&
      newColor.g === previousColors[previousColors.length - 1].g &&
      newColor.b === previousColors[previousColors.length - 1].b &&
      newColor.a === previousColors[previousColors.length - 1].a
    ) {
      return true;
    }

    return false;
  }

  hide(): void {
    this.showSubject.next(false);
  }

  get color(): Color {
    return this.colorSubject.getValue();
  }

  set color(newColor: Color) {
    this.colorSubject.next(newColor);
  }

  changeColor = (newColor: Color, colorBase: string): void => {
    this.color = newColor;
    this.currentColorBase = colorBase;
  }

  confirmSelectedColor(selectedColor: Color): void {
    this.hide();
    if (this.currentColorBase === 'primary') {
      this.colorService.primaryColor = selectedColor.copy();
    } else if (this.currentColorBase === 'secondary') {
      this.colorService.secondaryColor = selectedColor.copy();
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Color } from '../../models/color';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  currentColor: Color;
  private readonly primaryColorSubject: BehaviorSubject<Color>;
  private readonly secondaryColorSubject: BehaviorSubject<Color>;
  readonly primaryColor$: Observable<Color>;
  readonly secondaryColor$: Observable<Color>;
  constructor() {
    this.primaryColorSubject = new BehaviorSubject<Color>(
      new Color('#febfa4'),
    );
    this.secondaryColorSubject = new BehaviorSubject<Color>(
      new Color('#0b224f'),
    );
    this.primaryColor$ = this.primaryColorSubject.asObservable();
    this.secondaryColor$ = this.secondaryColorSubject.asObservable();
    this.currentColor = this.primaryColor.copy();
  }

  get primaryColor(): Color {
    return this.primaryColorSubject.getValue();
  }

  set primaryColor(colors: Color) {
    this.primaryColorSubject.next(colors);
  }

  set primaryColorHex(colorHex: string) {
    this.primaryColorSubject.next(new Color(colorHex));
  }

  set secondaryColor(color: Color) {
    this.secondaryColorSubject.next(color);
  }
  get secondaryColor(): Color {
    return this.secondaryColorSubject.getValue();
  }
  set secondaryColorHex(colorHex: string) {
    this.secondaryColorSubject.next(new Color(colorHex));
  }
}

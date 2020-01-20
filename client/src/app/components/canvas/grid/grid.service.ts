import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GridAttributs {
  opacity: number;
  sizeBigSquare: number;
  sizeSmallSquare: number;
  dPathSmallGrid: string;
  dPathBigGrid: string;
  showGrid: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class GridService {
  private readonly showGridSubject: BehaviorSubject<boolean>;
  private readonly opacitySubject: BehaviorSubject<number>;
  private readonly sizeBigSquareSubject: BehaviorSubject<number>;
  private readonly sizeSmallSquareSubject: BehaviorSubject<number>;

  opacity$: Observable<number>;
  sizeBigSquare$: Observable<number>;
  sizeSmallSquare$: Observable<number>;
  showGrid$: Observable<boolean>;
  dPathBigGrid$: Observable<string>;
  dPathSmallGrid$: Observable<string>;

  dPathSmallGrid: string;
  dPathBigGrid: string;
  defaultOpacity = 1;
  defaultShowGrid = false;
  defaultSizeSmallSquare = 10;
  defaultSizeBigSquare = 100;
  defaultDPathSmallGrid = 'M 10 0 L 0 0 0 10';
  defaultDPathBigGrid = 'M 100 0 L 0 0 0 100';
  dPathSmallGridSubject: BehaviorSubject<string>;
  dPathBigGridSubject: BehaviorSubject<string>;

  constructor() {
    this.opacitySubject = new BehaviorSubject<number>(this.defaultOpacity);
    this.sizeBigSquareSubject = new BehaviorSubject<number>(
      this.defaultSizeBigSquare,
    );
    this.sizeSmallSquareSubject = new BehaviorSubject<number>(
      this.defaultSizeSmallSquare,
    );
    this.showGridSubject = new BehaviorSubject<boolean>(this.defaultShowGrid);

    this.dPathSmallGridSubject = new BehaviorSubject<string>(
      this.defaultDPathSmallGrid,
    );
    this.dPathBigGridSubject = new BehaviorSubject<string>(
      this.defaultDPathBigGrid,
    );
    this.opacity$ = this.opacitySubject.asObservable();
    this.sizeBigSquare$ = this.sizeBigSquareSubject.asObservable();
    this.sizeSmallSquare$ = this.sizeSmallSquareSubject.asObservable();
    this.dPathSmallGrid = this.defaultDPathSmallGrid;
    this.dPathBigGrid = this.defaultDPathBigGrid;
    this.showGrid$ = this.showGridSubject.asObservable();
  }
  get opacity(): number {
    return this.opacitySubject.getValue();
  }
  set opacity(newOpacity: number) {
    this.opacitySubject.next(newOpacity);
  }
  get sizeBigSquare(): number {
    return this.sizeBigSquareSubject.getValue();
  }
  set sizeBigSquare(newSizeBigSquare: number) {
    this.sizeBigSquareSubject.next(newSizeBigSquare);
    this.dPathBigGrid = `M ${newSizeBigSquare} 0 L 0 0 0 ${newSizeBigSquare}`;
  }
  get sizeSmallSquare(): number {
    return this.sizeSmallSquareSubject.getValue();
  }

  set sizeSmallSquare(newSizeSmallSquare: number) {
    this.sizeSmallSquareSubject.next(newSizeSmallSquare);
    this.dPathSmallGrid = `M ${newSizeSmallSquare} 0 L 0 0 0 ${newSizeSmallSquare}`;
  }
  get showGrid(): boolean {
    return this.showGridSubject.getValue();
  }
  set showGrid(newShowGrid: boolean) {
    this.showGridSubject.next(newShowGrid);
  }
  toggleShowGrid(value: boolean): void {
    this.showGridSubject.next(value);
  }
}

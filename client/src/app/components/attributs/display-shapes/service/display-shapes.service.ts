import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';

@Injectable({
  providedIn: 'root',
})
export class DisplayShapesService {
  private svgsSubject: BehaviorSubject<Map<SVGGraphicsElement, ShapeAbs>>;
  readonly svgs$: Observable<Map<SVGGraphicsElement, ShapeAbs>>;
  constructor() {
    this.svgsSubject = new BehaviorSubject<Map<SVGGraphicsElement, ShapeAbs>>(new Map());
    this.svgs$ = this.svgsSubject.asObservable();
  }

  get svgs(): Map<SVGGraphicsElement, ShapeAbs> {
    return this.svgsSubject.getValue();
  }

  set svgs(newShape: Map<SVGGraphicsElement, ShapeAbs>) {
    this.svgsSubject.next(newShape);
  }

  isEmpty(): boolean {
    return this.svgs.size === 0;
  }

  addSvgElement(key: SVGGraphicsElement, shape: ShapeAbs): void {
    this.svgsSubject.getValue().set(key, shape);
  }

  deleteSvg(key: SVGGraphicsElement): void {
    const tempSvgs: Map<SVGGraphicsElement, ShapeAbs> = this.svgsSubject.getValue();
    tempSvgs.delete(key);
    this.svgsSubject.next(tempSvgs);
  }

  emptySvgs(): void {
    this.svgsSubject.next(new Map<SVGGraphicsElement, ShapeAbs>());
  }
}

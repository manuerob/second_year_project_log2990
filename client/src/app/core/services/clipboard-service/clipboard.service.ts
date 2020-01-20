import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShapeComposite } from 'src/app/core/models/shapes/shape-composite';
import { Point } from '../../models/type';
import { ShapeDependencyService } from './../shape-dependency/shape-dependency.service';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private readonly shapeCompositeSubject: BehaviorSubject<ShapeComposite>;
  readonly shapeComposite$: Observable<ShapeComposite>;
  readonly isAvailable$: Observable<boolean>;
  clipOrigin: Point;
  isClipboardEmpty: boolean;
  renderer: Renderer2;
  constructor(
    shapeDependency: ShapeDependencyService,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.shapeCompositeSubject = new BehaviorSubject<ShapeComposite>(
      new ShapeComposite(
        shapeDependency,
        {} as SVGGraphicsElement,
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ),
    );
    this.isClipboardEmpty = true;
    this.shapeComposite$ = this.shapeCompositeSubject.asObservable();
  }

  get shapeComposite(): ShapeComposite {
    return this.shapeCompositeSubject.getValue();
  }

  set shapeComposite(newShapes: ShapeComposite) {
    this.shapeCompositeSubject.next(newShapes.copyObject());
    this.isClipboardEmpty = false;
  }

  reset(): void {
    this.shapeCompositeSubject.next(this.shapeComposite.copyObject());
  }
}

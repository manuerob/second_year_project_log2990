import { ElementRef, Injectable } from '@angular/core';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Graph } from 'src/app/core/models/graph';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { SimpleShapeAbs } from 'src/app/core/models/shapes/simple-shape';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { DisplayShapesService } from '../../attributs/display-shapes/service/display-shapes.service';

@Injectable({
  providedIn: 'root',
})
export class SaveDrawingService extends AbstractSubscriptions {
  canvasRef: ElementRef;
  graph: Graph;
  backgroundColor: string;
  currentGraphSaved: boolean;
  shapesMap: Map<SVGGraphicsElement, ShapeAbs>;

  constructor(
    private api: ApiService,
    private drawingService: DrawingService,
    private shapesService: DisplayShapesService,
  ) {
    super();
    this.subscriptions = [];

    this.currentGraphSaved = false;

    this.subscriptions.push(
      this.api.graph$.subscribe((graph) => {
        this.graph = graph;
      }),
    );
    this.subscriptions.push(
      this.shapesService.svgs$.subscribe(
        (svg: Map<SVGGraphicsElement, ShapeAbs>) => {
          this.shapesMap = svg;
        },
      ),
    );

    this.subscriptions.push(
      this.drawingService.canvasRef$.subscribe((canvasRef: ElementRef) => {
        this.canvasRef = canvasRef;
      }),
    );
  }

  // tslint:disable-next-line: no-any
  saveAs(
    title: string = this.graph.title,
    tags: string[] = this.graph.tags,
    // tslint:disable-next-line: no-any
  ): any {
    this.graph = { ...this.graph, title, tags };
    this.updateSavedImage();
    this.currentGraphSaved = true;
    const shapeList: SimpleShapeAbs[] = [];
    this.graph.shapes.forEach((value: ShapeAbs) => {
      shapeList.push(value.simplify);
    });
    return { ...this.graph, shapes: shapeList };
  }

  save(
    title: string = this.graph.title,
    tags: string[] = this.graph.tags,
  ): void {
    this.updateSavedImage();
    this.graph = { ...this.graph, title, tags };
    // tslint:disable-next-line: no-console no-empty
    this.api.saveSVG(this.graph).subscribe(() => {});
    this.currentGraphSaved = true;
  }

  updateSavedImage(): void {
    const svgInner: SVGGraphicsElement = this.canvasRef.nativeElement.innerHTML;
    this.api.graph.htmlElement = `<svg
      style="background:${this.graph.backgroundColor}"
      #canvas
      width="100%"
      height="100%"
      viewBox="0 0 ${this.graph.width} ${this.graph.height}">
      ${svgInner}
    </svg>`;
    this.api.graph.shapes = this.shapesMap;
  }
}

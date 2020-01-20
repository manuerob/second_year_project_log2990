import { ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import {
  DEFAULT_HEIGHT_CANVAS,
  DEFAULT_WIDTH_CANVAS,
} from '../../../../../../common/constants/constants';
import { Color } from '../../models/color';
import { ShapeAbs } from '../../models/shapes/shape-abs';
import { AbstractSubscriptions } from './../../helper/class/abstract-subscriptions';
import { Graph } from './../../models/graph';
import { ApiService } from './../api/api.service';

export class DrawingService extends AbstractSubscriptions {
  width$: Observable<number>;
  height$: Observable<number>;
  title: string;
  isDrawing: boolean;
  graph: Graph;
  private widthSubject: BehaviorSubject<number>;
  private heightSubject: BehaviorSubject<number>;
  private canvasColorSubject: Subject<Color>;
  canvasColor$: Observable<Color>;
  private currentColor: Color;
  private readonly canvasRefSubject: ReplaySubject<ElementRef>;
  readonly canvasRef$: Observable<ElementRef>;

  constructor(private api: ApiService) {
    super();
    this.widthSubject = new BehaviorSubject<number>(DEFAULT_WIDTH_CANVAS);
    this.width$ = this.widthSubject.asObservable();
    this.heightSubject = new BehaviorSubject<number>(DEFAULT_HEIGHT_CANVAS);
    this.height$ = this.heightSubject.asObservable();
    this.canvasColorSubject = new Subject<Color>();
    this.canvasRefSubject = new ReplaySubject<ElementRef>(1);
    this.canvasRef$ = this.canvasRefSubject.asObservable();
    this.canvasColor$ = this.canvasColorSubject.asObservable();
    this.currentColor = new Color();
    this.title = 'Sans-titre';
    this.isDrawing = false;
    this.subscriptions.push(
      this.api.graph$.subscribe((graph: Graph) => {
        this.graph = graph;
        this.widthSubject.next(graph.width);
        this.heightSubject.next(graph.height);
      }),
    );
    this.initializeFormGroup();
  }

  set canvasRef(canvasRef: ElementRef) {
    this.canvasRefSubject.next(canvasRef);
  }

  get width(): number {
    return this.widthSubject.getValue();
  }
  set width(newWidth: number) {
    this.width = newWidth;
  }

  get height(): number {
    return this.heightSubject.getValue();
  }
  set height(newheight: number) {
    this.height = newheight;
  }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fileName: new FormControl('', Validators.required),
    fileHeight: new FormControl('', [Validators.required, Validators.min(1)]),
    fileWidth: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  initializeFormGroup(): void {
    this.form.setValue({
      $key: null,
      fileName: this.title,
      fileWidth: this.graph.width,
      fileHeight: this.graph.height,
    });
  }

  changeCurrentColor(color: Color): void {
    this.currentColor = color.copy();
  }

  updateSize(newWidth: number, newHeight: number): void {
    const currentWidth: number = this.form.value.fileWidth;
    const currentHeight: number = this.form.value.fileHeight;

    if (currentWidth === DEFAULT_WIDTH_CANVAS && currentHeight === DEFAULT_HEIGHT_CANVAS) {
      this.form.patchValue({
        fileWidth: newWidth,
        fileHeight: newHeight,
      });
    }
  }

  isFormValid(): boolean {
    return this.form.valid && this.currentColor !== undefined;
  }

  createDrawing(): void {
    this.title = this.form.value.fileName;
    this.api.graph = {
      title: this.form.value.fileName,
      width: this.form.value.fileWidth,
      height: this.form.value.fileHeight,
      htmlElement: '',
      backgroundColor: this.currentColor.getColorString(),
      tags: [],
      id: '',
      shapes: new Map<SVGGraphicsElement, ShapeAbs>(),
      createdAt: 0,
    };
  }
}

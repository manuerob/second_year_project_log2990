import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { PageEvent } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import 'moment/locale/fr';
import { Observable, Subscriber } from 'rxjs';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { AbstractSubscriptions } from 'src/app/core/helper/class/abstract-subscriptions';
import { Graph, Graph2 } from 'src/app/core/models/graph';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { SimpleShapeAbs } from 'src/app/core/models/shapes/simple-shape';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import {
  ERROR_INVALID_FILE,
  ERROR_OPEN_FILE,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '../../../../../common/constants/constants';
import { UPLOAD } from './../../../../../common/constants/constants';
import { CustomModalService } from './../../core/services/modal/custom-modal.service';
import { DisplayShapesService } from './../attributs/display-shapes/service/display-shapes.service';
import { LoadShapeService } from './service/load-shape.service';

@Component({
  selector: 'app-edit-drawing',
  templateUrl: './edit-drawing.component.html',
  styleUrls: ['./edit-drawing.component.scss'],
})
export class EditDrawingComponent extends AbstractSubscriptions implements OnInit {
  graphs: Graph[];
  filteredGraphs: Graph[];
  graphsOnPage: Graph[];
  isLoading: boolean;
  isLoadingTags: boolean;
  errorNoCardSelected: boolean;
  errorOpenFile: boolean;
  warning: boolean;
  length: number;
  pageSize: number;
  pageSizeOptions: number[];
  private currentGraphSelected: Graph;
  uploadedFiles: File[];
  canvasRef: ElementRef;
  fileReader: FileReader;
  fileName: string;
  renderer: Renderer2;
  currentTags: string[];

  constructor(
    private api: ApiService,
    private savedDrawing: SaveDrawingService,
    private dialogRef: MatDialogRef<EditDrawingComponent>,
    private svgsService: DisplayShapesService,
    private modal: CustomModalService,
    private loadShapeService: LoadShapeService,
    public drawingService: DrawingService,
    rendererFactory: RendererFactory2,
  ) {
    super();
    this.length = 0;
    this.filteredGraphs = [];
    this.graphs = [];
    this.graphsOnPage = [];
    this.isLoading = true;
    this.isLoadingTags = true;
    this.warning = false;
    this.errorNoCardSelected = false;
    this.errorOpenFile = false;
    this.fileReader = new FileReader();
    this.pageSize = PAGE_SIZE;
    this.fileName = UPLOAD;
    this.pageSizeOptions = PAGE_SIZE_OPTIONS;
    this.renderer = rendererFactory.createRenderer(null, null);
    this.drawingService.canvasRef$.subscribe((canvasRef) => {
      this.canvasRef = canvasRef;
    });
    this.currentTags = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.api.getSVGs().subscribe((graphs: Graph[]) => {
      this.resetDrawings(graphs);
      this.refreshTags();
    }));
  }

  get emptyCanvas(): boolean {
    return this.svgsService.isEmpty();
  }

  private refreshTags(): void {
    this.isLoadingTags = true;
    const tags: string[] = [];
    this.graphs.map((graph: Graph) => {
      graph.tags.map((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    this.api.tags = tags;
    this.isLoadingTags = false;
  }

  private refreshDrawings(graphs: Graph[]): void {
    this.isLoading = false;
    this.filteredGraphs = graphs;
    this.length = this.filteredGraphs.length;
    this.graphsOnPage = this.filteredGraphs.slice(0, PAGE_SIZE);
    this.fileReader.onerror = (event: ProgressEvent): void => {
      this.errorOpenFile = true;
      throw new Error(ERROR_OPEN_FILE);
    };
  }

  private resetDrawings(graphs: Graph[]): void {
    this.graphs = graphs;
    this.refreshDrawings(graphs);
  }

  hasWarning(): boolean {
    return (
      this.errorNoCardSelected ||
      this.errorOpenFile ||
      (!this.warning && (!this.emptyCanvas && !this.savedDrawing.currentGraphSaved))
    );
  }

  clearOpenFileError(): void {
    this.errorOpenFile = false;
  }

  canEdit(): boolean {
    if (this.currentGraphSelected) {
      return this.currentGraphSelected.shapes && this.currentGraphSelected.title.length !== 0;
    }
    return false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydownHandler(): void {
    this.onClose();
  }

  onClose(): void {
    this.modal.close();
    this.dialogRef.close();
  }

  selectCard(graph: Graph): void {
    this.currentGraphSelected = graph;
    this.errorNoCardSelected = false;
  }

  filter(tags: string[]): void {
    this.filteredGraphs = this.graphs.filter((graph: Graph) => {
      for (const tag of tags) {
        if (graph.tags.includes(tag)) {
          return true;
        }
      }
      return false;
    });
  }

  closeWarning(): void {
    this.errorNoCardSelected = false;
    this.warning = true;
  }

  activeCard(id: string): boolean {
    if (this.currentGraphSelected) {
      if (this.currentGraphSelected.id === id) {
        return true;
      }
    }
    return false;
  }

  onChangeSelectedTags(tags: string[]): void {
    if (tags.length) {
      this.filter(tags);
    } else {
      this.filteredGraphs = this.graphs;
    }
    this.currentTags = tags;
    this.refreshDrawings(this.filteredGraphs);
  }

  pageChanged($event: PageEvent): void {
    this.graphsOnPage = this.filteredGraphs.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize,
    );
  }

  openCard(): void {
    if (this.currentGraphSelected) {
      this.api.graph = this.currentGraphSelected;
      const jsonGraph = JSON.parse(JSON.stringify(this.currentGraphSelected));
      const shapeMap: Map<SVGGraphicsElement, ShapeAbs> = new Map();
      Object.keys(jsonGraph.shapes).forEach((shapeIndex) => {
        const shapeObject = jsonGraph.shapes[shapeIndex];
        const object = this.loadShapeService.loadShape(shapeObject);
        if (object) {
          shapeMap.set(object.htmlElement, object);
        }
      });

      this.api.graph = {
        title: jsonGraph.title,
        tags: jsonGraph.tags,
        width: jsonGraph.width,
        height: jsonGraph.height,
        backgroundColor: jsonGraph.backgroundColor,
        id: jsonGraph.id,
        htmlElement: jsonGraph.htmlElement,
        shapes: shapeMap,
      } as Graph;

      shapeMap.forEach((value: ShapeAbs) => {
        value.render();
      });

      this.svgsService.svgs = shapeMap;
      this.onClose();
    }
    this.errorNoCardSelected = true;
    this.savedDrawing.currentGraphSaved = false;
  }

  async deleteCard(): Promise<void> {
    if (this.currentGraphSelected) {
      this.isLoading = true;
      await this.api.deleteSVG(this.currentGraphSelected.id);
      this.api.getSVGs().toPromise().then((graphs: Graph[]) => {
        this.graphs = graphs;
        this.refreshTags();
      }).then(() => {
        this.onChangeSelectedTags(this.currentTags);
      }).then(() => {
        this.refreshDrawings(this.filteredGraphs);
      });
    }
  }

  async onSaveOld(): Promise<void> {
    await this.savedDrawing.save();
    this.api.getSVGs().toPromise().then((graphs: Graph[]) => {
      this.graphs = graphs;
      this.refreshTags();
    }).then(() => {
      this.onChangeSelectedTags(this.currentTags);
    }).then(() => {
      this.refreshDrawings(this.filteredGraphs);
    });
  }

  // tslint:disable-next-line: no-any
  changeFile(element: any): void {
    this.uploadedFiles = element.target.files;
    this.upload().subscribe();
  }

  // tslint:disable-next-line: no-any
  upload(): Observable<any> {
    this.errorOpenFile = false;
    return this.verifyFile();
  }

  // tslint:disable-next-line: no-any
  verifyFile(): Observable<any> {
    this.fileReader.onload = (): void => {
      this.openFile(this.fileReader.result);
    };

    this.fileName = this.uploadedFiles[0].name;

    // tslint:disable-next-line: no-any
    return new Observable((observer: Subscriber<any[]>): void => {
      this.fileReader.readAsText(this.uploadedFiles[0]);
    });
  }

  private isValidGraphFile(jsonGraph: Graph | Graph2): boolean {
    let onlyValidPropertyFound = true;
    const expectedValidProperties: string[] = [
      'title',
      'tags',
      'id',
      'width',
      'height',
      'backgroundColor',
      'htmlElement',
      'shapes',
      'createdAt',
    ];
    Object.keys(jsonGraph).some((property: string) => {
      if (!expectedValidProperties.includes(property)) {
        onlyValidPropertyFound = false;
      }
      return !expectedValidProperties.includes(property);
    });
    return (
      onlyValidPropertyFound && Object.keys(jsonGraph).length === expectedValidProperties.length
    );
  }

  openFile(fileContent: string | ArrayBuffer | null): void {
    let jsonGraph: Graph2;
    if (fileContent) {
      try {
        jsonGraph = JSON.parse(fileContent.toString());
        if (!this.isValidGraphFile(jsonGraph)) {
          throw new Error(ERROR_INVALID_FILE);
        }

        const shapeMap: Map<SVGGraphicsElement, ShapeAbs> = new Map();
        jsonGraph.shapes.forEach((value: SimpleShapeAbs) => {
          const object = this.loadShapeService.loadShape(value);
          if (object) {
            shapeMap.set(object.htmlElement, object);
          }
        });

        this.api.graph = {
          title: jsonGraph.title,
          tags: jsonGraph.tags,
          id: jsonGraph.id,
          width: jsonGraph.width,
          height: jsonGraph.height,
          backgroundColor: jsonGraph.backgroundColor,
          htmlElement: jsonGraph.htmlElement,
          shapes: shapeMap,
        } as Graph;

        shapeMap.forEach((value: ShapeAbs) => {
          value.render();
        });

        this.svgsService.svgs = shapeMap;

        this.onClose();
      } catch (err) {
        this.errorOpenFile = true;
      }
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Message } from '../../../../../../common/communication/message';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_HEIGHT_CANVAS,
  DEFAULT_WIDTH_CANVAS,
  SERVER_URL,
} from '../../../../../../common/constants/constants';
import { ShapeAbs } from '../../models/shapes/shape-abs';
import { SimpleShapeAbs } from '../../models/shapes/simple-shape';
import { Graph } from './../../models/graph';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly graphsSubject: BehaviorSubject<Graph[]>;
  private readonly graphSubject: BehaviorSubject<Graph>;
  private readonly tagsSubject: BehaviorSubject<string[]>;
  readonly graph$: Observable<Graph>;
  readonly graphs$: Observable<Graph[]>;
  readonly tags$: Observable<string[]>;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.graphsSubject = new BehaviorSubject<Graph[]>([]);
    this.graphSubject = new BehaviorSubject<Graph>({
      title: 'sans-titre',
      id: '',
      htmlElement: '',
      width: DEFAULT_WIDTH_CANVAS,
      height: DEFAULT_HEIGHT_CANVAS,
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      tags: [],
      shapes: new Map(),
      createdAt: 0,
    });
    this.tagsSubject = new BehaviorSubject<string[]>([]);
    this.graph$ = this.graphSubject.asObservable();
    this.graphs$ = this.graphsSubject.asObservable();
    this.tags$ = this.tagsSubject.asObservable();
  }

  get graph(): Graph {
    return this.graphSubject.getValue();
  }

  set graph(newGraph: Graph) {
    this.graphSubject.next(newGraph);
  }

  get tags(): string[] {
    return this.tagsSubject.getValue();
  }

  set tags(tags: string[]) {
    this.tagsSubject.next(tags);
  }

  addTag(newTag: string): void {
    this.tagsSubject.getValue().push(newTag);
  }

  saveSVG(graph: Graph): Observable<Message> {
    return this.http
      .post<Message>(SERVER_URL + 'svg', this.stringify(graph), {
        headers: this.headers,
        responseType: 'json',
      })
      .pipe(
        catchError((error: Error) => {
          return throwError(error);
        }),
      );
  }

  exportSVG(graph: Graph): Observable<Message> {
    // tslint:disable-next-line: no-any
    const test: any = this.stringify(graph);
    return this.http
      .post<Message>(SERVER_URL + 'svg', test, {
        headers: this.headers,
        responseType: 'json',
      })
      .pipe(
        catchError((error: Error) => {
          return throwError(error);
        }),
      );
  }

  // tslint:disable-next-line: no-any
  stringify(graph: Graph): any {
    const shapeList: SimpleShapeAbs[] = [];
    graph.shapes.forEach((value: ShapeAbs) => {
      shapeList.push(value.simplify);
    });

    return { ...graph, shapes: shapeList };
  }

  modifySVG(graph: Graph): Observable<Message> {
    return this.http
      .put<Message>(SERVER_URL + 'svg', graph, {
        headers: this.headers,
        responseType: 'json',
      })
      .pipe(
        catchError((error: Error) => {
          return throwError(error);
        }),
      );
  }

  getSVGs(): Observable<Graph[]> {
    return this.http.get<Graph[]>(SERVER_URL + 'svg').pipe(
      map((graphs: Graph[]) => {
        const sortedGraphs = this.sortGraphsByTimeDesc(graphs);
        return sortedGraphs;
      }),
      catchError((error: Error) => {
        return throwError(error);
      }),
    );
  }

  deleteSVG(id: string): Promise<void> {
    return this.http.delete<void>(SERVER_URL + 'svg/' + id).toPromise();
  }

  private sortGraphsByTimeDesc(array: Graph[]): Graph[] {
    return array.sort((a: Graph, b: Graph) => {
      return b.createdAt - a.createdAt;
    });
  }
}

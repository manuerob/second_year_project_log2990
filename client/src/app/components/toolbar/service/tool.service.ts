import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import RegularCommandTool from 'src/app/core/models/regular-command-tool';
import { ToolAbs } from 'src/app/core/models/tool-abs';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  selectCommand: RegularCommandTool;

  private readonly activeToolSubject: ReplaySubject<ToolAbs>;
  readonly activeTool$: Observable<ToolAbs>;

  constructor() {

    this.activeToolSubject = new ReplaySubject<ToolAbs>(1);

    this.activeTool$ = this.activeToolSubject.asObservable();
  }

  set activeTool(tool: ToolAbs) {
    this.activeToolSubject.next(tool);
  }
}

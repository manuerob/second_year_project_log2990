import { HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { ColorService } from 'src/app/core/services/color/color.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { HotkeyManagerService } from 'src/app/core/services/hotkey/hotkey-manager.service';
import { SelectHandlerService } from 'src/app/core/services/shape-service/select-handler/select-handler.service';
import { AttributsService } from '../../attributs.service';
import { DisplayShapesService } from '../../display-shapes/service/display-shapes.service';
import { SelectControlsComponent } from './select-controls.component';

describe('SelectControlsComponent', () => {
  let component: SelectControlsComponent;
  let fixture: ComponentFixture<SelectControlsComponent>;
  let fakeSelectHandler: SelectHandlerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectControlsComponent],
      imports: [MatIconModule, MatDialogModule, HttpClientTestingModule, MatTooltipModule],
      providers: [
        SelectHandlerService,
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
        HttpHandler,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectControlsComponent);
    component = fixture.componentInstance;
    fakeSelectHandler = TestBed.get(SelectHandlerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called onCopy', () => {
    const spy = spyOn(fakeSelectHandler, 'onCopy');
    component.copy();
    expect(spy).toHaveBeenCalled();
  });

  it('should have called onPaste', () => {
    const spy = spyOn(fakeSelectHandler, 'onPaste');
    component.paste();
    expect(spy).toHaveBeenCalled();
  });
  it('should have called onDuplicate', () => {
    const spy = spyOn(fakeSelectHandler, 'onDuplicate');
    component.duplicate();
    expect(spy).toHaveBeenCalled();
  });

  it('should have called onCut', () => {
    const spy = spyOn(fakeSelectHandler, 'onCut');
    component.cut();
    expect(spy).toHaveBeenCalled();
  });
  it('should return available false at the start', () => {
    expect(component.cannotPaste()).toBeTruthy();
  });
  it('should return available true for there\'s something in the array array', () => {
    // tslint:disable-next-line: no-any
    fakeSelectHandler.shape = { shapes: [1, 2] } as any;
    expect(component.cannotPaste()).toBeTruthy();
  });
});

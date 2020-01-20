import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatIconModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditDrawingComponent } from './edit-drawing.component';
import { TagsComponent } from './tags/tags.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MomentModule } from 'ngx-moment';
import { ApiService } from 'src/app/core/services/api/api.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { ERROR_OPEN_FILE } from '../../../../../common/constants/constants';
import { SaveDrawingService } from '../save-drawing/service/save-drawing.service';
import { SafePipe } from './../../core/pipes/safe-html/safe.pipe';
import { CustomButtonComponent } from './../../shared/custom-button/custom-button.component';

describe('EditDrawingComponent', () => {
  let component: EditDrawingComponent;
  let fixture: ComponentFixture<EditDrawingComponent>;
  let fakeDrawingService: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomButtonComponent, EditDrawingComponent, TagsComponent, SafePipe],
      imports: [
        MatAutocompleteModule,
        FormsModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatOptionModule,
        HttpClientTestingModule,
        MomentModule,
      ],
      providers: [
        ApiService,
        SaveDrawingService,
        DrawingService,
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawingComponent);
    component = fixture.componentInstance;
    fakeDrawingService = TestBed.get(DrawingService);
    component.canvasRef = { nativeElement: { childNodes: [] } };
    fakeDrawingService.canvasRef = { nativeElement: 'any' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.get(ApiService)).toBeTruthy();
    expect(TestBed.get(SaveDrawingService)).toBeTruthy();
    expect(component.length).toBe(0);
  });

  it('should close dialog', () => {
    spyOn(component, 'onClose');
    // tslint:disable-next-line: no-any
    (component as any).currentGraphSelected = {
      shapes: {
        values(): [] {
          return [];
        },
      },
    };
    component.openCard();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should not close dialog', () => {
    spyOn(component, 'onClose');
    // tslint:disable-next-line: no-any
    (component as any).currentGraphSelected = false;
    component.openCard();
    expect(component.onClose).not.toHaveBeenCalled();
    expect(component.errorNoCardSelected).toBeTruthy();
  });

  it('should not validate file content', () => {
    const fakeWrongFileContent = {
      titleRandom: '',
      tags0: '',
      id: '',
      htmlElement: '',
      shapes: '',
    };
    spyOn(component, 'onClose');
    spyOn(component, 'openFile').and.callThrough();
    component.openFile(JSON.stringify(fakeWrongFileContent));
    expect(component.errorOpenFile).toBeTruthy();
  });

  it('should validate file content', () => {
    const fakeValidFileContent = {
      title: '',
      tags: '',
      width: 0,
      height: 0,
      backgroundColor: 0,
      id: '',
      htmlElement: '',
      shapes: [],
      createdAt: 0,
    };
    spyOn(component, 'onClose');
    component.openFile(JSON.stringify(fakeValidFileContent));
    expect(component.errorOpenFile).toBeFalsy();
    expect(component.openFile).not.toThrowError(ERROR_OPEN_FILE);
  });
});

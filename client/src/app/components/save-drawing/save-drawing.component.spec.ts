import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ERROR_MESSAGE } from '../../../../../common/constants/constants';
import { SaveDrawingComponent } from './save-drawing.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatChipInputEvent,
  MatChipsModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipe } from 'src/app/core/pipes/safe-html/safe.pipe';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { DisplayShapesService } from '../attributs/display-shapes/service/display-shapes.service';
import { CustomButtonComponent } from './../../shared/custom-button/custom-button.component';
import { SaveDrawingService } from './service/save-drawing.service';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;
  let save: SaveDrawingService;
  let shapeService: DisplayShapesService;
  let dialogSpy: jasmine.Spy;

  const dialogMock = {
    close: () => {
      return;
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveDrawingComponent, SafePipe, CustomButtonComponent],
      imports: [
        MatAutocompleteModule,
        FormsModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatOptionModule,
        HttpClientTestingModule,
      ],
      providers: [
        SaveDrawingService,
        DrawingService,
        { provide: MatDialogRef, useValue: dialogMock },
        DisplayShapesService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.get(DrawingService).canvasRef = { nativeElement: 'any' };
    TestBed.get(SaveDrawingService).canvasRef = { nativeElement: 'any' };
    fixture = TestBed.createComponent(SaveDrawingComponent);
    save = TestBed.get(SaveDrawingService);
    shapeService = TestBed.get(DisplayShapesService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // tslint:disable-next-line: no-string-literal
    dialogSpy = spyOn(component['dialogRef'], 'close').and.callFake(
      dialogMock.close,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #updateSavedImage on init', () => {
    const spy = spyOn(save, 'updateSavedImage');
    spyOn(shapeService, 'isEmpty');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.tags).toEqual([]);
    expect(shapeService.isEmpty).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.drawing).not.toBeNull();
  });

  it('should close modal', () => {
    component.onClose();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('should add tags', () => {
    expect(component.tags).toEqual([]);
    const event = { value: 'onetag1' };
    component.add(event as MatChipInputEvent);
    expect(component.tags).toEqual(['onetag1']);
  });

  it('should allow save', () => {
    component.drawing = true;
    component.fileName.setValue('onetitle');
    expect(component.canSave).toBeTruthy();
    component.drawing = false;
    fixture.detectChanges();
    expect(component.canSave).toBeTruthy();
  });

  it('should disallow save', () => {
    component.drawing = true;
    component.fileName.setValue('');
    expect(component.fileName.valid).toBeFalsy();
  });

  it('should prevent save', () => {
    component.fileName.setValue('');
    expect(component.error).toBeFalsy();
    spyOn(save, 'save');
    spyOn(component, 'onClose');
    component.onSave();
    expect(component.error).toBe(ERROR_MESSAGE);
    expect(save.save).toHaveBeenCalled();
    expect(component.onClose).not.toHaveBeenCalled();
  });

  it('should complete save', () => {
    component.fileName.setValue('onetitle');
    expect(component.error).toBeFalsy();
    spyOn(save, 'save');
    spyOn(component, 'onClose');
    spyOn(component.fileName, 'hasError').and.callThrough();
    component.onSave();
    expect(component.error).toBeFalsy();
    expect(save.save).toHaveBeenCalled();
    expect(component.onClose).toHaveBeenCalled();
  });

  it('display the error message on getError ', () => {
    const spy = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.getErrorMessage();
    expect(spy).toHaveBeenCalled();
  });
  it('display the error message on getError ', () => {
    const spy = spyOn(component.fileName, 'hasError').and.returnValue(true);
    component.getErrorMessage();
    expect(spy).toHaveBeenCalled();
  });

  it('display an empty error message on getError ', () => {
    const spy = spyOn(component.fileName, 'hasError').and.returnValue(false);
    component.getErrorMessage();
    const data = '';
    expect(spy).toHaveBeenCalled();
    expect(component.error).toBe(data);
  });
});

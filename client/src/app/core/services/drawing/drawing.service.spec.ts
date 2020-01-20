import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';

describe('DrawingService', () => {
  let drawingService: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomButtonComponent],
      imports: [HttpClientTestingModule],
      providers: [DrawingService],
    }).compileComponents();
  }));

  beforeEach(() => {
    drawingService = TestBed.get(DrawingService);
  });

  it('should initialize form to default value', () => {
    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(500);
    expect(drawingService.form.value.fileWidth).toBe(500);
  });

  it('should update dimensions', () => {
    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(500);
    expect(drawingService.form.value.fileWidth).toBe(500);

    drawingService.updateSize(300, 700);

    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(700);
    expect(drawingService.form.value.fileWidth).toBe(300);
  });

  it('should not update dimensions when changing width', () => {
    drawingService.form.patchValue({
      fileWidth: 100,
    });
    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(500);
    expect(drawingService.form.value.fileWidth).toBe(100);

    drawingService.updateSize(300, 700);

    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(500);
    expect(drawingService.form.value.fileWidth).toBe(100);
  });

  it('should not update dimensions when changing width', () => {
    drawingService.form.patchValue({
      fileHeight: 100,
    });
    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(100);
    expect(drawingService.form.value.fileWidth).toBe(500);

    drawingService.updateSize(300, 700);

    expect(drawingService.form.value.fileName).toBe('Sans-titre');
    expect(drawingService.form.value.fileHeight).toBe(100);
    expect(drawingService.form.value.fileWidth).toBe(500);
  });

  it('should be a valid form', () => {
    expect(drawingService.isFormValid()).toBeTruthy();
  });

  it('should not to be a valid form', () => {
    expect(drawingService.isFormValid()).toBeTruthy();
    drawingService.form.patchValue({
      fileWidth: -1,
    });
    expect(drawingService.isFormValid()).toBeFalsy();
  });

  it('form should to be created with default width', (done: DoneFn) => {
    drawingService.width$.subscribe((width) => {
      expect(width).toBe(drawingService.form.value.fileWidth);
      done();
    });
    drawingService.createDrawing();
  });

  it('form should to be created with default height', (done: DoneFn) => {
    drawingService.height$.subscribe((height) => {
      expect(height).toBe(drawingService.form.value.fileHeight);
      done();
    });
    drawingService.createDrawing();
  });
});

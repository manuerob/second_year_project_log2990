import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Color } from 'src/app/core/models/color';
import { ColorHexadecimalComponent } from './color-hexadecimal.component';

describe('ColorHexadecimalComponent', () => {
  let component: ColorHexadecimalComponent;
  let fixture: ComponentFixture<ColorHexadecimalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorHexadecimalComponent],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorHexadecimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be instanciated to a new FormBuilder on component init', () => {
    component.ngOnInit();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it('rgba hex value should match the valid form value (6 numbers)', () => {
    const white = '#ffffff';
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(white);
    component.onSubmit();
    expect(component.rgba.hex).toEqual(white);
  });

  it('rgba hex value should match the valid form value (3 numbers)', () => {
    const white = '#fff';
    const whitePattern = '#'.concat(
      white[1],
      white[1],
      white[2],
      white[2],
      white[3],
      white[3],
    );
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(white);
    component.onSubmit();
    expect(component.rgba.hex).toEqual(whitePattern);
  });

  it('rgba hex value should not match an invalid form value', () => {
    const invalidColor = '#xxx';
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(invalidColor);
    component.onSubmit();
    expect(component.rgba.hex).not.toEqual(invalidColor);
  });

  it('rgba hex value should not match a form value that doesnt start with #', () => {
    const invalidColor = 'xxx';
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(invalidColor);
    component.onSubmit();
    expect(component.rgba.hex).not.toEqual(invalidColor);
  });

  it('rgba hex value should not match a form value with length greater then 6 (numbers)', () => {
    const invalidColor = '#ffffff3';
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(invalidColor);
    component.onSubmit();
    expect(component.rgba.hex).not.toEqual(invalidColor);
  });

  it('rgba hex value should not match a form value with length smaller then 3 (numbers)', () => {
    const invalidColor = '#ff';
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(invalidColor);
    component.onSubmit();
    expect(component.rgba.hex).not.toEqual(invalidColor);
  });

  it('selected color value should not change if not submitted', () => {
    const color = new Color('#ff4');
    component.ngOnInit();
    component.form.controls.hexadecimalCode.setValue(color.hex);
    expect(component.rgba.hex).not.toEqual(color.hex);
  });

  it('rgba hex value should match input color hex value when it changes', () => {
    const color = new Color('#ff4');
    component.rgba = color;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.controls.hexadecimalCode.value).toEqual(color.hex);

    const color2 = new Color('#0f0');
    component.rgba = color2;
    fixture.detectChanges();
    expect(component.form.controls.hexadecimalCode.value).toEqual(color2.hex);
  });
});

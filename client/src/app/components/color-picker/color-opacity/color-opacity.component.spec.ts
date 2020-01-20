import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorOpacityComponent } from './color-opacity.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Color } from 'src/app/core/models/color';

describe('ColorOpacityComponent', () => {
  let component: ColorOpacityComponent;
  let fixture: ComponentFixture<ColorOpacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorOpacityComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorOpacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opacity should match selected color opacity', () => {
    const color = new Color('#ff4');
    component.rgba = color;
    component.ngOnInit();
    expect(component.opacity).toEqual(color.a * 100);

    const color2 = new Color('#0f0');
    component.rgba = color2;
    expect(component.opacity).toEqual(color2.a * 100);
  });

  it('opacity should match selected color opacity on change', () => {
    const lightOpacity = 25;
    component.opacity = lightOpacity;
    component.onChange();
    expect(component.rgba.a).toEqual(lightOpacity / 100);
  });
});

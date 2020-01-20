import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSpectrumComponent } from './color-spectrum.component';

describe('ColorSpectrumComponent', () => {
  let component: ColorSpectrumComponent;
  let fixture: ComponentFixture<ColorSpectrumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSpectrumComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSpectrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

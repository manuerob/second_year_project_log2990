import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayShapesComponent } from './display-shapes.component';

describe('DisplayShapesComponent', () => {
  let component: DisplayShapesComponent;
  let fixture: ComponentFixture<DisplayShapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayShapesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

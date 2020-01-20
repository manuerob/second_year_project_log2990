import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousColorsComponent } from './previous-colors.component';

describe('PreviousColorsComponent', () => {
  let component: PreviousColorsComponent;
  let fixture: ComponentFixture<PreviousColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousColorsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

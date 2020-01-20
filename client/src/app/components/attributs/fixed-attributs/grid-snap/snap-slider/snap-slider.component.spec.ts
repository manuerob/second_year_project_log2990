import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SnapSliderComponent } from './snap-slider.component';

describe('SnapSliderComponent', () => {
  let component: SnapSliderComponent;
  let fixture: ComponentFixture<SnapSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapSliderComponent ], imports: [MatSlideToggleModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SlideToggleComponent } from './../../controls/slide-toggle/slide-toggle.component';
import { GridSliderComponent } from './grid-slider/grid-slider.component';
import { GridSnapComponent } from './grid-snap.component';
import { SnapSliderComponent } from './snap-slider/snap-slider.component';

describe('GridSnapComponent', () => {
  let component: GridSnapComponent;
  let fixture: ComponentFixture<GridSnapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridSnapComponent,
        SlideToggleComponent,
        SnapSliderComponent,
        GridSliderComponent,
      ],
      imports: [MatSlideToggleModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSnapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

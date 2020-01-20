import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { DiscreteSliderComponent } from './discrete-slider.component';

describe('DiscreteSliderComponent', () => {
  let component: DiscreteSliderComponent;
  let fixture: ComponentFixture<DiscreteSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSliderModule,
        MatSlideToggleModule, FormsModule],
      declarations: [DiscreteSliderComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscreteSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

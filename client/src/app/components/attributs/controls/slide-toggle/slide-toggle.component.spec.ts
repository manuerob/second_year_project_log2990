import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { SlideToggleComponent } from './slide-toggle.component';

describe('SlideToggleComponent', () => {
  let component: SlideToggleComponent;
  let fixture: ComponentFixture<SlideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSliderModule,
        MatSlideToggleModule],
      declarations: [SlideToggleComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleModule } from '@angular/material';
import { GridService } from 'src/app/components/canvas/grid/grid.service';
import { GridSliderComponent } from './grid-slider.component';

describe('GridSliderComponent', () => {
  let component: GridSliderComponent;
  let fixture: ComponentFixture<GridSliderComponent>;
  let fakeGridService: GridService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridSliderComponent],
      imports: [MatSlideToggleModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSliderComponent);
    fakeGridService = TestBed.get(GridService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('# ontoggle should  modify the value of checked correctly', () => {
    component.onToggle();
    expect(fakeGridService.showGrid).not.toBe(false);
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { GridSliderComponent } from './../grid-slider/grid-slider.component';
import { GridControlsComponent } from './grid-controls.component';
import { GridOpacityComponent } from './grid-opacity/grid-opacity.component';
import { GridSizesquareComponent } from './grid-sizesquare/grid-sizesquare.component';

describe('GridControlsComponent', () => {
  let component: GridControlsComponent;
  let fixture: ComponentFixture<GridControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridControlsComponent,
        GridSliderComponent,
        GridOpacityComponent,
        GridSizesquareComponent,
        InputNumberComponent,
      ],
      imports: [
        MatSlideToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

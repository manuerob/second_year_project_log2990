import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridService } from 'src/app/components/canvas/grid/grid.service';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { GridOpacityComponent } from './grid-opacity.component';

describe('GridOpacityComponent', () => {
  let component: GridOpacityComponent;
  let fixture: ComponentFixture<GridOpacityComponent>;
  let fakeGridService: GridService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridOpacityComponent, InputNumberComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      providers: [GridService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOpacityComponent);
    fakeGridService = TestBed.get(GridService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('# onUpdateOpacity should  modify the grid opacity attribut correctly', () => {
    const newValue = 45;
    component.onUpdateOpacity(newValue);
    expect(fakeGridService.opacity).toBe(0.45);
  });

  it('# onUpdateOpacity should  not accept value not in opacity range ', () => {
    const newValue = 5;
    component.onUpdateOpacity(newValue);
    expect(fakeGridService.opacity).not.toEqual(5);
  });
});

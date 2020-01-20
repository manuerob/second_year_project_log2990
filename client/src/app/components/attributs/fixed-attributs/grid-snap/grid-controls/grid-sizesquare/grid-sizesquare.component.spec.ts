import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridService } from 'src/app/components/canvas/grid/grid.service';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { GridSizesquareComponent } from './grid-sizesquare.component';

describe('GridSizesquareComponent', () => {
  let component: GridSizesquareComponent;
  let fixture: ComponentFixture<GridSizesquareComponent>;
  let fakeGridService: GridService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridSizesquareComponent,
        InputNumberComponent,
        DropdownListComponent,
      ],
      imports: [
        FormsModule,
        MatSelectModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [GridService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSizesquareComponent);
    fakeGridService = TestBed.get(GridService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('# onUpdateSizeBigSquare should  modify the grid big and small square size attribut correctly', () => {
    const newValue = 80;
    component.onUpdateSizeBigSquare(newValue);
    expect(fakeGridService.sizeBigSquare).toBe(80);
    expect(fakeGridService.sizeSmallSquare).toBe(8);
  });

  it('# onUpdateSizeBigSquare should no accept a valuer out of size square range', () => {
    const newValue = 10;
    component.onUpdateSizeBigSquare(newValue);
    expect(fakeGridService.sizeBigSquare).not.toEqual(10);
    expect(fakeGridService.sizeSmallSquare).not.toEqual(1);
  });
});

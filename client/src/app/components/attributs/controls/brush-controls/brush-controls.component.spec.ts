import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { BrushControlsComponent } from './brush-controls.component';

import { MatDialogModule } from '@angular/material/dialog';

describe('BrushControlsComponent', () => {
  let component: BrushControlsComponent;
  let fixture: ComponentFixture<BrushControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrushControlsComponent,
        InputNumberComponent,
        DropdownListComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

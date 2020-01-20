import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { DropdownListComponent } from './../../../../shared/custom-dropdown-list/custom-dropdown-list.component';
import { CircleControlsComponent } from './circle-controls.component';

import { MatDialogModule, MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CircleControlsComponent', () => {
  let component: CircleControlsComponent;
  let fixture: ComponentFixture<CircleControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleControlsComponent , InputNumberComponent, DropdownListComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

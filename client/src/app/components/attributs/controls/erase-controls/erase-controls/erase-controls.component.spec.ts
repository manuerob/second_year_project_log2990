import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from '../../../attributs.service';
import { EraseControlsComponent } from './erase-controls.component';

describe('EraseControlsComponent', () => {
  let component: EraseControlsComponent;
  let fixture: ComponentFixture<EraseControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EraseControlsComponent, InputNumberComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraseControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set eraseSize attribut on input value change', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newEraseSize = 18;
    component.onEraseSizeChange(newEraseSize);
    expect(service.attributs.eraseSize).toBe(newEraseSize);
    expect(component).toBeTruthy();
  });
});

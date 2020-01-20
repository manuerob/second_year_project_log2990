import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasComponent } from './canvas.component';

import { DrawingService } from '../../core/services/drawing/drawing.service';

import { MatDialogModule, MatFormFieldModule } from '@angular/material';

import { GridComponent } from './grid/grid.component';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasComponent, GridComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatFormFieldModule],
      providers: [DrawingService, HttpClient],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

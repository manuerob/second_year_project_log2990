import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { PenControlsComponent } from './pen-controls.component';

describe('PenControlsComponent', () => {
  let component: PenControlsComponent;
  let fixture: ComponentFixture<PenControlsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PenControlsComponent, InputNumberComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [AttributsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update max width', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newWidth = 46;
    component.onMaxWidthChange(newWidth);
    expect(service.attributs.width).toBe(newWidth);
  });

  it('should update min width', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newWidth = 5;
    component.onMinWidthChange(newWidth);
    expect(service.attributs.minWidth).toBe(newWidth);
  });
});

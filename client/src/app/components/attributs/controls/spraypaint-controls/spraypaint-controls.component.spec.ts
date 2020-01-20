import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberComponent } from 'src/app/shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { SpraypaintControlsComponent } from './spraypaint-controls.component';

describe('SpraypaintControlsComponent', () => {
  let component: SpraypaintControlsComponent;
  let fixture: ComponentFixture<SpraypaintControlsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpraypaintControlsComponent, InputNumberComponent],
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
    fixture = TestBed.createComponent(SpraypaintControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update width', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newWidth = 46;
    component.onWidthChange(newWidth);
    expect(service.attributs.width).toBe(newWidth);
  });

  it('should update emission rate', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const rate = 5;
    component.onEmissionRateChange(rate);
    expect(service.attributs.emissionRate).toBe(rate);
  });
});

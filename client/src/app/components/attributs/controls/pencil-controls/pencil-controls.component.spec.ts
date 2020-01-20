import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttributsService } from '../../attributs.service';
import { InputNumberComponent } from './../../../../shared/input-number/input-number.component';
import { PencilControlsComponent } from './pencil-controls.component';

describe('PencilControlsComponent', () => {
  let component: PencilControlsComponent;
  let fixture: ComponentFixture<PencilControlsComponent>;
  let attributsService: AttributsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PencilControlsComponent, InputNumberComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [AttributsService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilControlsComponent);
    component = fixture.componentInstance;
    attributsService = TestBed.get(AttributsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change width value', () => {
    component.onWidthChange(200);
    expect(attributsService.attributs.width).toEqual(200);
  });
});

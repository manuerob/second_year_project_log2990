import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from 'src/app/shared/custom-dropdown-list/custom-dropdown-list.component';
import { InputNumberComponent } from '../../../../shared/input-number/input-number.component';
import { AttributsService } from '../../attributs.service';
import { TextControlsComponent } from './text-controls.component';

describe('TextControlsComponent', () => {
  let component: TextControlsComponent;
  let fixture: ComponentFixture<TextControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextControlsComponent, InputNumberComponent, DropdownListComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatSelectModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update font size', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newFontSize = 42;
    component.onFontSizeChange(newFontSize);
    expect(service.attributs.fontSize).toBe(newFontSize);
  });

  it('should update text alignment', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newAlign = 'end';
    component.onAlignTypeChange(newAlign);
    expect(service.attributs.alignmentType).toBe(newAlign);
  });

  it('should update mutator', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newMutator = 'italic';
    component.onMutatorChange(newMutator);
    expect(service.attributs.mutator).toBe(newMutator);
  });

  it('should update font', () => {
    const service: AttributsService = TestBed.get(AttributsService);
    const newFont = 'courrier';
    component.onFontChange(newFont);
    expect(service.attributs.font).toBe(newFont);
  });
});

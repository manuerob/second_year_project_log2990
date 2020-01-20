import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule, MatOptionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownListComponent } from './custom-dropdown-list.component';

describe('DropdownListComponent', () => {
  let component: DropdownListComponent;
  let fixture: ComponentFixture<DropdownListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownListComponent],
      imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ], providers: [MatSelect],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit on change', () => {
    const event: unknown = '';
    const spy = spyOn(component.valueChanged, 'emit');
    component.onValueChanged(event as MatSelectChange);
    expect(spy).toHaveBeenCalled();
  });
});

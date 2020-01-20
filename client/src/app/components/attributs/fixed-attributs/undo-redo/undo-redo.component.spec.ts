import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommandManagerService } from './../../../../core/services/command-manager/command-manager.service';
import { UndoRedoComponent } from './undo-redo.component';

describe('UndoRedoComponent', () => {
  let component: UndoRedoComponent;
  let fixture: ComponentFixture<UndoRedoComponent>;
  let fakeCommandManager: CommandManagerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UndoRedoComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        MatTooltipModule,
      ],
      providers: [CommandManagerService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoRedoComponent);
    fakeCommandManager = TestBed.get(CommandManagerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called undo', () => {
    const spy = spyOn(fakeCommandManager, 'undo');
    component.undo();
    expect(spy).toHaveBeenCalled();
  });

  it('should have called redo', () => {
    const spy = spyOn(fakeCommandManager, 'redo');
    component.redo();
    expect(spy).toHaveBeenCalled();
  });
});

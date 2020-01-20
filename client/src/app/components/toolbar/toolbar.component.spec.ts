import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';

import { ColorService } from './../../core/services/color/color.service';

import { ButtonComponent } from './button/button.component';

import { HotkeyManagerService } from './../../core/services/hotkey/hotkey-manager.service';

import { ToolService } from 'src/app/components/toolbar/service/tool.service';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let fakeColorService: ColorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent, ButtonComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MatDialogRef, useValue: {} }, ColorService, HotkeyManagerService, ToolService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fakeColorService = fixture.debugElement.injector.get(ColorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instanciate a new sessionDataSession', () => {
    expect(fakeColorService).toBeTruthy();
  });
});

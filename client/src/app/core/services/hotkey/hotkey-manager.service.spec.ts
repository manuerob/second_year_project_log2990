import { async, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material';
import { CustomModalService } from '../modal/custom-modal.service';
import { HotkeyManagerService } from './hotkey-manager.service';

describe('HotkeyManagerService', () => {
  let serviceHotkeyManager: HotkeyManagerService;
  let modal: CustomModalService;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [CustomModalService, { provide: MatDialogRef, useValue: {} }],
    })));
  beforeEach(() => {
    serviceHotkeyManager = TestBed.get(HotkeyManagerService);
    modal = TestBed.get(CustomModalService);
  });

  it('should be created', () => {
    expect(serviceHotkeyManager).toBeTruthy();
  });

  it('should update Hotkeys ', () => {
    expect(serviceHotkeyManager).toBeTruthy();
  });

  it('It should return the hotkeys value on get called', () => {
    const color: Record<string, boolean> = {
      ['keydown']: true,
    };
    serviceHotkeyManager.hotkeys = color;
    spyOnProperty(serviceHotkeyManager, 'hotkeys', 'get').and.returnValue(
      color,
    );
    expect(serviceHotkeyManager.hotkeys).toBe(color);
  });

  it('It should modify the hotkeys value correctly on set called', () => {
    const color: Record<string, boolean> = {
      ['keydown']: true,
    };
    serviceHotkeyManager.hotkeys = color;
    spyOnProperty(serviceHotkeyManager, 'hotkeys', 'set').and.returnValue(
      color,
    );
    expect(serviceHotkeyManager.hotkeys).toBe(color);
  });

  it('it should update hotkey on event type equal to keydown', () => {
    const event: KeyboardEvent = new KeyboardEvent('keydown', {
      type: 'keydown',
      code: 'false',
    } as KeyboardEventInit);
    serviceHotkeyManager.udpateHotkeys(event);
    expect(serviceHotkeyManager.hotkeys[event.code]).toBe(true);
  });

  it('it should update hotkey on event type equal to keyup', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      type: 'keyup',
      code: 'false',
    } as KeyboardEventInit);
    serviceHotkeyManager.udpateHotkeys(event);
    expect(serviceHotkeyManager.hotkeys[event.code]).toBe(false);
  });

  it('should return a boolean', () => {
    modal.isModalOpen = false;
    serviceHotkeyManager.available = true;
    serviceHotkeyManager.isAvailable();
    expect(serviceHotkeyManager.isAvailable()).toBeTruthy();
  });

  it('should return a boolean', () => {
    modal.isModalOpen = true;
    serviceHotkeyManager.available = true;
    serviceHotkeyManager.isAvailable();
    expect(serviceHotkeyManager.isAvailable()).toBeFalsy();
  });
});

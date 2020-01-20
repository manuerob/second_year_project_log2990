import { TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material';
import { CustomModalService } from './custom-modal.service';

describe('CustomModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatDialogModule],
    providers: [{ provide: MatDialogRef, useValue: {} }],
  }));

  it('should be created', () => {
    const service: CustomModalService = TestBed.get(CustomModalService);
    expect(service).toBeTruthy();
  });
});

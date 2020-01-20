import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { PipetteControlsComponent } from './pipette-controls.component';

describe('PipetteControlsComponent', () => {
  let component: PipetteControlsComponent;
  let fixture: ComponentFixture<PipetteControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PipetteControlsComponent],
      providers: [
        DrawingService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

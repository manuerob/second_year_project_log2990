import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DisplayShapesService } from './display-shapes.service';

describe('DisplayShapesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports : [HttpClientModule, ],
  }));

  it('should be created', () => {
    const service: DisplayShapesService = TestBed.get(DisplayShapesService);
    expect(service).toBeTruthy();
  });
});

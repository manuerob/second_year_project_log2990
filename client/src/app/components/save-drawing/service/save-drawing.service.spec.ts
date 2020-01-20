import { async, TestBed } from '@angular/core/testing';

import SpyObj = jasmine.SpyObj;

import { ApiService } from 'src/app/core/services/api/api.service';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { DisplayShapesService } from './../../attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from './save-drawing.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SaveDrawingService', () => {
  let api: SpyObj<ApiService>;
  let service: SaveDrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule],
      providers: [DrawingService, DisplayShapesService, ApiService],
    }).compileComponents();
  }));

  beforeEach(() => {
    api = jasmine.createSpyObj('ApiService', ['saveSVG']);
    api.saveSVG.and.returnValue(of({ title: '', body: '' }));

    service = TestBed.get(SaveDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call updateSavedImage', () => {
    const spyService = spyOn(service, 'updateSavedImage');
    service.save('', []);
    expect(spyService).toHaveBeenCalled();
  });

  it('should unsubscribe all subscriptions', () => {
    const spySub = spyOn(service.subscriptions[0], 'unsubscribe');
    service.ngOnDestroy();
    expect(spySub).toHaveBeenCalled();
  });
});

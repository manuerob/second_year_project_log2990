import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Message } from '../../../../../../common/communication/message';
import { Graph } from '../../models/graph';
import { ApiService } from './api.service';

const BASE_URL = 'http://localhost:3000/';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let fakeGraph: Graph;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.get(ApiService);
    httpMock = TestBed.get(HttpTestingController);
    fakeGraph = {
      title: 'name',
      tags: ['tag'],
      width: 100,
      height: 100,
      backgroundColor: '#fff',
      id: 'id0',
      htmlElement: 'elem',
      shapes: new Map(),
      createdAt: 0,
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save SVG', () => {
    it('should call save SVG', () => {
      const expectedResponse: Message = { title: 'ok', body: 'ok' };
      service.saveSVG(fakeGraph).subscribe((resp: Message) => {
        expect(resp).toBe(expectedResponse);
      });
      const req: TestRequest = httpMock.expectOne(BASE_URL + 'svg', 'call to api');
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
      httpMock.verify();
    });

    it('should handle error of save SVG', () => {
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      service.saveSVG(fakeGraph).subscribe(
        (data) => fail('should have failed as error'),
        (err: HttpErrorResponse) => {
          expect(err).not.toBeNull();
        },
      );

      const req: TestRequest = httpMock.expectOne(BASE_URL + 'svg', 'call to api');
      req.error(new ErrorEvent('fake network error'), mockErrorResponse);
      httpMock.verify();
    });
  });

  describe('modify SVG', () => {
    it('should call modify SVG', () => {
      const expectedResponse: Message = { title: 'ok', body: 'ok' };

      service.modifySVG(fakeGraph).subscribe((resp: Message) => {
        expect(resp).toBe(expectedResponse);
      });
      const req: TestRequest = httpMock.expectOne(BASE_URL + 'svg', 'call to api');
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResponse);
      httpMock.verify();
    });

    it('should handle error of modify SVG', () => {

      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      service.modifySVG(fakeGraph).subscribe(
        (data) => fail('should have failed as error'),
        (err: HttpErrorResponse) => {
          expect(err).not.toBeNull();
        },
      );

      const req: TestRequest = httpMock.expectOne(BASE_URL + 'svg', 'call to api');
      req.error(new ErrorEvent('fake network error'), mockErrorResponse);
      httpMock.verify();
    });
  });

  describe('get SVGs', () => {
    it('should call get SVGs', () => {
      const fakeGraph1: Graph = {
        title: 'name',
        tags: ['tag'],
        id: 'id0',
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        htmlElement: 'elem',
        shapes: new Map(),
        createdAt: 0,
      };
      const fakeGraph2: Graph = {
        title: 'name',
        tags: ['tag1'],
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        id: 'id1',
        htmlElement: 'elem1',
        shapes: new Map(),
        createdAt: 0,
      };
      const expectedResponse: Graph[] = [fakeGraph1, fakeGraph2];
      service.getSVGs().subscribe((resp: Graph[]) => {
        expect(resp).toBe(expectedResponse);
      });
      const req: TestRequest = httpMock.expectOne(BASE_URL + 'svg', 'call to api');
      expect(req.request.method).toBe('GET');
      req.flush(expectedResponse);
      httpMock.verify();
    });

    it('should handle error of get SVGs', () => {
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      service.getSVGs().subscribe(
        (data) => fail('should have failed as error'),
        (err: HttpErrorResponse) => {
          expect(err).not.toBeNull();
        },
      );

      const req: TestRequest = httpMock.expectOne(BASE_URL + 'svg', 'call to api');
      req.error(new ErrorEvent('fake network error'), mockErrorResponse);
      httpMock.verify();
    });
  });
});

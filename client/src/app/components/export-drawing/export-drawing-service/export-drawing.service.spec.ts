import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/core/services/drawing/drawing.service';
import { DisplayShapesService } from '../../attributs/display-shapes/service/display-shapes.service';
import { CanvasToBMP } from '../canvasToBMP';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingService', () => {
  let service: ExportDrawingService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule],
      providers: [DrawingService, DisplayShapesService],
    }).compileComponents(),
  );

  beforeEach(() => {
    service = TestBed.get(ExportDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exportToSvg should call load ', () => {
    spyOn(service, 'loadBlob');
    service.canvasRef = { nativeElement: {} as Node } as any;
    spyOn(XMLSerializer.prototype, 'serializeToString');
    service.exportToSvg();
    expect(service.loadBlob).toHaveBeenCalled();
  });

  it('load should call download', () => {
    const spyObj = jasmine.createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(spyObj);
    const data: Blob = new Blob();
    service.loadBlob(data);
    expect(spyObj.click).toHaveBeenCalled();
    expect(spyObj.click).toHaveBeenCalledTimes(1);
    expect(spyObj.download).toBe('sans-titre.svg');
  });

  it('ctx should not call drawImage', () => {
    service.ctx = null;
    expect(service.myCanvas).toBeTruthy();
    const spy1 = spyOn(service.myCanvas, 'toDataURL');
    service.drawImage('', '');
    expect(spy1).not.toHaveBeenCalled();
  });

  it(' xmlToBase64 should return a string', () => {
    service.canvasRef = { nativeElement: {} as Node } as any;
    spyOn(XMLSerializer.prototype, 'serializeToString');
    const data: string = service.xmlToBase64();
    expect(service.xmlToBase64()).toBe(data);
  });

  it(' xmlToBlob should call function toBlob', () => {
    const spy = spyOn(CanvasToBMP.prototype, 'toBlob');
    service.xmlToBlob();
    expect(spy).toHaveBeenCalled();
  });

  it(' exportToJpeg should call drawImage', () => {
    spyOn(service, 'drawImage').and.callThrough();
    spyOn(service, 'xmlToBase64');
    service.exportToJpeg();
    expect(service.drawImage).toHaveBeenCalled();
  });

  it(' exportToPng should call drawImage', () => {
    spyOn(service, 'drawImage').and.callThrough();
    spyOn(service, 'xmlToBase64');
    service.exportToPng();
    expect(service.drawImage).toHaveBeenCalled();
  });

  it(' exportToBmp should call drawImage', () => {
    spyOn(service, 'drawImage').and.callThrough();
    spyOn(service, 'xmlToBase64');
    service.exportToBmp();
    expect(service.drawImage).toHaveBeenCalled();
  });

  it('should unsubscribe all subscriptions', () => {
    const spySub = spyOn(service.subscriptions[0], 'unsubscribe');
    service.ngOnDestroy();
    expect(spySub).toHaveBeenCalled();
  });
});

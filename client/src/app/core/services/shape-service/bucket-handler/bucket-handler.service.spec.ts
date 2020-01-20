import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { AttributsService } from 'src/app/components/attributs/attributs.service';
import { DisplayShapesService } from 'src/app/components/attributs/display-shapes/service/display-shapes.service';
import { SaveDrawingService } from 'src/app/components/save-drawing/service/save-drawing.service';
import { ToolService } from 'src/app/components/toolbar/service/tool.service';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { Color } from 'src/app/core/models/color';
import { BucketObject } from 'src/app/core/models/shapes/bucket-object';
import {
  ALPHA_VALUE, BLUE_VALUE, GREEN_VALUE, MAXIMUM_COLOR_DISTANCE_3D,
  PERCENTAGE, RED_VALUE, RGBA_VALUES
} from '../../../../../../../common/constants/constants';
import { ApiService } from '../../api/api.service';
import { ColorService } from '../../color/color.service';
import { DrawingService } from '../../drawing/drawing.service';
import { HotkeyManagerService } from '../../hotkey/hotkey-manager.service';
import { ShapeDependencyService } from '../../shape-dependency/shape-dependency.service';
import { PipetteHandlerService } from '../pipette-handler/pipette-handler.service';
import { BucketHandlerService } from './bucket-handler.service';

interface Rgba {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

interface Pixel {
  position: number;
  color: Rgba;
}

const PRIMARYCOLOR: Color = new Color('#006600');
const SECONDARYCOLOR: Color = new Color('#999999');

describe('BucketHandlerService', () => {
  let service: BucketHandlerService;
  let shapeDepedency: ShapeDependencyService;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [],
      providers: [
        PipetteHandlerService,
        { provide: Renderer2, useClass: MockRenderer },
        { provide: RendererFactory2, useClass: MockRendererFactory },
        ColorService,
        AttributsService,
        DrawingService,
        ToolService,
        BucketHandlerService,
        DisplayShapesService,
        SaveDrawingService,
        HotkeyManagerService,
        ApiService,
        ShapeDependencyService,
      ],
    }).compileComponents(),
  );

  beforeEach(() => {
    service = TestBed.get(BucketHandlerService);
    shapeDepedency = TestBed.get(ShapeDependencyService);
    service.canvasRef = {
      nativeElement:
        // tslint:disable-next-line: max-line-length
        '<svg xmlns="http://www.w3.org/2000/svg" _ngcontent-agy-c2="" style="width: 3px; height: 3px;"> <rect _ngcontent-agy-c2="" height="100%" width="100%" style="fill: rgb(255, 255, 255);" /> <g _ngcontent-agy-c0=""> <polyline _ngcontent-agy-c0="" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#4ed053" stroke-width="12" stroke-opacity="1" points="0,0 0,0 " transform="translate(0, 0) rotate(0)" /> </g> <g _ngcontent-agy-c0=""> <polyline _ngcontent-agy-c0="" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#4ed053" stroke-width="12" stroke-opacity="1" points="0,0 0,0 " transform="translate(1, 0) rotate(0)" /> </g></svg>',
    };
    service.primaryColor = PRIMARYCOLOR;
    service.secondaryColor = SECONDARYCOLOR;
    // tslint:disable-next-line: no-magic-numbers
    service.origin = { x: 0, y: 0 };
    service.innerPoints = [{ x: 23, y: 16 }, { x: 3, y: 9 }];
    service.bottomRightPoint = { x: 23, y: 16 };
    service.lookupColor = { red: 20, green: 255, blue: 130, alpha: 1 };
    service.canvasData = new ImageData(new Uint8ClampedArray(80000), 200, 100);
    service.pointsToKeep = [{ position: 0, color: { red: 45, green: 54, blue: 45, alpha: 45 } },
    { position: 1, color: { red: 78, green: 87, blue: 87, alpha: 78 } },
    { position: 2, color: { red: 69, green: 96, blue: 69, alpha: 96 } }];

    service.pointsToVisit = [{ position: 0, color: { red: 46, green: 56, blue: 46, alpha: 46 } },
    { position: 1, color: { red: 79, green: 88, blue: 88, alpha: 79 } },
    { position: 2, color: { red: 70, green: 97, blue: 70, alpha: 97 } }];

    service.tempCanvas = service.renderer.createElement('canvas');

    service.shape = new BucketObject(
      shapeDepedency,
      shapeDepedency.renderer.createElement('g', 'svg'),
      service.primaryColor,
      service.secondaryColor,
      service.origin,
      {
        x: service.bottomRightPoint.x - service.origin.x,
        y: service.bottomRightPoint.y - service.origin.y,
      },
      service.attributs.width,
      service.attributs.plotType,
      service.borderPoints,
      service.innerPoints,
    );

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a pixel on getRgbaColorAtCoordonate called ', () => {

    const x = 5;
    const y = 10;
    const newPosition = y * (service.canvasWidth * RGBA_VALUES) + x * RGBA_VALUES;
    const newColor = {
      red: service.canvasData.data[newPosition + RED_VALUE],
      green: service.canvasData.data[newPosition + GREEN_VALUE],
      blue: service.canvasData.data[newPosition + BLUE_VALUE],
      alpha: service.canvasData.data[newPosition + ALPHA_VALUE],
    };
    const tempPixel = service.getRgbaColorAtCoordonate(x, y);
    expect(tempPixel.position).toEqual(newPosition);
    expect(tempPixel.color).toEqual(newColor);
  });

  it('should return a point', () => {
    const position = 5;
    const newX = (position / RGBA_VALUES) % service.canvasWidth;
    const newY = Math.floor(position / RGBA_VALUES / service.canvasWidth);
    const tempPoint = service.fromPositionToCoordonate(position);
    expect(tempPoint.x).toEqual(newX);
    expect(tempPoint.y).toEqual(newY);

  });

  it('should return a string on bufferToBase64 called', () => {
    const buf = [65, 66, 67];
    const binstr = buf.map((value) => {
      return String.fromCharCode(value);
    })
      .join('');
    const temp1 = btoa(binstr);
    const tempPoint = service.bufferToBase64(buf);
    expect(tempPoint).toEqual(temp1);

  });

  it('should return a pixel on getRgbaColorAtPosition called ', () => {

    const position = 5;
    const newColor = {
      red: service.canvasData.data[position + RED_VALUE],
      green: service.canvasData.data[position + GREEN_VALUE],
      blue: service.canvasData.data[position + BLUE_VALUE],
      alpha: service.canvasData.data[position + ALPHA_VALUE],
    };
    const tempPixel = service.getRgbaColorAtPosition(position);
    expect(tempPixel.position).toEqual(position);
    expect(tempPixel.color).toEqual(newColor);
  });

  it('should modify the extremes on checkExtrems called', () => {
    const currentPoint = { x: 2, y: 5 };
    const myOrigin = {
      x: Math.min(service.origin.x, currentPoint.x),
      y: Math.min(service.origin.y, currentPoint.y),
    };
    const myBottomRightPoint = {
      x: Math.max(service.bottomRightPoint.x, currentPoint.x),
      y: Math.max(service.bottomRightPoint.y, currentPoint.y),
    };
    service.checkExtrems(currentPoint);
    expect(service.origin).toEqual(myOrigin);
    expect(service.bottomRightPoint).toEqual(myBottomRightPoint);
  });

  it('should return a boolean on isKeptColor called ', () => {
    const otherColor = { red: 2, green: 5, blue: 230, alpha: 1 };
    const colorDistance: number = Math.sqrt(
      Math.pow(otherColor.red - service.lookupColor.red, 2) +
      Math.pow(otherColor.green - service.lookupColor.green, 2) +
      Math.pow(otherColor.blue - service.lookupColor.blue, 2),
    );
    const temp = service.isKeptColor(otherColor);
    if (colorDistance <= (service.attributs.tolerance / PERCENTAGE) * MAXIMUM_COLOR_DISTANCE_3D) {
      expect(temp).toEqual(true);
    } else { expect(temp).toEqual(false); }
  });

  it('should look around a pixel on lookAroundPoint called ', () => {
    const pixel: Pixel = { position: 2, color: { red: 2, green: 5, blue: 230, alpha: 1 } };
    const pixels: Pixel[] = [pixel, pixel, pixel, pixel];
    const spy = spyOn(service, 'getNeighborPixel').and.returnValue(pixels);

    service.lookAroundPoint(pixel);
    expect(spy).toHaveBeenCalled();
  });

  it('should find pixel alike the pixel given on findPixelsAlike  called ', () => {
    service.pointsToKeep = [{ position: 0, color: { red: 45, green: 54, blue: 45, alpha: 45 } },
    { position: 1, color: { red: 78, green: 87, blue: 87, alpha: 78 } },
    { position: 2, color: { red: 69, green: 96, blue: 69, alpha: 96 } }];
    service.createPolygon = jasmine.createSpy();
    const initialPoint: Pixel = { position: 2, color: { red: 2, green: 5, blue: 230, alpha: 1 } };
    const spy = spyOn(service.pointsToKeep, 'push');
    service.findPixelsAlike(initialPoint);
    expect(spy).toHaveBeenCalled();
    expect(service.lookupColor).toEqual(initialPoint.color);
  });

  it('should return an array of pixel on getNeighborPixel called ', () => {
    const position = 2;
    const leftPoint = -RGBA_VALUES;
    const rightPointPoint = RGBA_VALUES;
    const bottomPoint = RGBA_VALUES * service.canvasWidth;
    const topPoint = -RGBA_VALUES * service.canvasWidth;

    const neighborPixel: Pixel[] = [
      service.getRgbaColorAtPosition(position + leftPoint),
      service.getRgbaColorAtPosition(position + rightPointPoint),
      service.getRgbaColorAtPosition(position + bottomPoint),
      service.getRgbaColorAtPosition(position + topPoint),
    ];
    const temp = service.getNeighborPixel(position);
    expect(temp[0]).toEqual(neighborPixel[0]);
  });

  it('should initialize arrays on initializeArrays called ', () => {
    const temp = new Set<number>();
    service.initializeArrays();
    expect(service.visitedPoints).toEqual(temp);
    expect(service.pointsToKeep).toEqual([]);
    expect(service.pointsToVisit).toEqual([]);
    expect(service.borderPoints).toEqual([]);
    expect(service.innerPoints).toEqual([]);
  });

});

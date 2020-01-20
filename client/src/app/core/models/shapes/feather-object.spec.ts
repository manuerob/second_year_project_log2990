import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { FeatherObject } from './feather-object';

describe('FeatherObject', () => {

    let object: FeatherObject;
    let fakeShapeDepedency: ShapeDependencyService;

    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DrawingService,
                ShapeDependencyService,
                { provide: Renderer2, useClass: MockRenderer },
                { provide: RendererFactory2, useClass: MockRendererFactory },
            ],
        }),
    );

    beforeEach(() => {
        fakeShapeDepedency = TestBed.get(ShapeDependencyService);
        object = new FeatherObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('g', 'svg'),
            new Color('#fff'),
            { x: 0, y: 0 },
            12,
            10,
        );
        object.strokeWidth = 4;
        object.linePoints = [{ x: 1, y: 12 }, { x: 5, y: 15 }, { x: 3, y: 5 }, { x: 5, y: 30 }, ];
        object.transformMatrix = [[1, 0], [0, 1], ];
        object.angles = [12, 50, 14, 24, 30];
        object.htmlElement = {} as SVGGraphicsElement;
        object.featherStrokes = [fakeShapeDepedency.renderer.createElement('polyline', 'svg'),
        fakeShapeDepedency.renderer.createElement('polyline', 'svg'), fakeShapeDepedency.renderer.createElement('polyline', 'svg'), ];

    });

    it('should copy the feather object ', () => {
        const tempFeather: FeatherObject = new FeatherObject(
            fakeShapeDepedency,
            object.renderer.createElement('g', 'svg'),
            object.color,
            object.linePoints[0],
            object.strokeWidth,
            object.strokeLength,
        );
        const spy1 = spyOn(object.renderer, 'createElement');
        const spy3 = spyOn(object.renderer, 'appendChild');

        const temp = object.copyObject();
        expect(temp.origin).toEqual(tempFeather.origin);
        expect(temp.color).toEqual(tempFeather.color);
        expect(temp.size).toEqual(tempFeather.size);
        expect(temp.strokeWidth).toEqual(tempFeather.strokeWidth);
        expect(temp.strokeLength).toEqual(tempFeather.strokeLength);
        expect(spy1).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('should update renderer  ', () => {
        const spy = spyOn(object, 'setRenderer');
        object.updateRender();
        expect(spy).toHaveBeenCalled();
    });

    it('should update renderer on render called  ', () => {
        const spy1 = spyOn(object, 'updateRender');
        const spy2 = spyOn(object, 'append');

        object.render();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should return a string on lineData called ', () => {
        const allFeatherPoints = [{ x: 3, y: 5 }, { x: 5, y: 8 }, { x: 6, y: 8 }];
        spyOn(object, 'calculatePoints').and.returnValue(allFeatherPoints);
        const num = 4;
        const angle = 20;
        const width = 10;
        const temp = object.lineData(num, angle, width);
        expect(temp).not.toEqual('');
    });

    it('should calculate x, y components of a point  ', () => {
        const point = { x: 4, y: 8 };
        const featherLength = 5;
        const degreeAngle = 20;
        const width = 10;
        const temp = object.calculateXYComponents(point, featherLength, width, degreeAngle);

        // tslint:disable-next-line: no-magic-numbers
        expect(temp.x).toEqual(-0.6984631039295426);
        // tslint:disable-next-line: no-magic-numbers
        expect(temp.y).toEqual(9.710100716628343);

    });

});

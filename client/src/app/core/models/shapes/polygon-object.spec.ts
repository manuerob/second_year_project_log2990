import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { PolygonObject } from './polygon-object';

describe('PolygonObject', () => {

    let object: PolygonObject;
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
        object = new PolygonObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('polyline', 'svg'),
            new Color('#fff'),
            new Color('#aff'),
            { x: 0, y: 0 },
            { x: 4, y: 12 },
            12,
            'dhhd',
            15,
            15,
        );
    });

    it('should copy the polygon object ', () => {
        const tempPolygon: PolygonObject = new PolygonObject(
            fakeShapeDepedency,
            object.renderer.createElement('polyline', 'svg'),
            object.color,
            object.outColor,
            object.origin,
            object.size,
            object.strokeWidth,
            object.plotType,
            object.angle,

        );
        const spy = spyOn(object.renderer, 'createElement');
        const temp = object.copyObject();
        expect(temp.color).toEqual(tempPolygon.color);
        expect(temp.size).toEqual(tempPolygon.size);
        expect(temp.color).toEqual(tempPolygon.color);
        expect(temp.transformMatrix).toEqual(tempPolygon.transformMatrix);
        expect(spy).toHaveBeenCalled();
    });

    it('should initialise line points on initLinePoints called  ', () => {
        const spy = spyOn(object.linePoints, 'push');
        object.initLinePoints();
        expect(object.linePoints.length).toBeGreaterThan(1);
        expect(spy).toHaveBeenCalled();
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

    it('should return a boolean on internCollid called  ', () => {
        const point = { x: 3, y: 5 };
        const temp = object.internCollid(point);
        expect(temp).toEqual(true);
    });
});

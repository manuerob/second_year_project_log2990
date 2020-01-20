import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { EllipseObject } from './ellipse-object';

describe('BrushObject', () => {

    let object: EllipseObject;
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
        object = new EllipseObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('polyline', 'svg'),
            new Color('#fff'),
            new Color('#ff3'),
            {x: 0, y: 0},
            {x: 5, y: 5},
            12,
            'dhhd',
            0,
        );
    });

    it('should copy the ellipse object ', () => {
        const tempBrush: EllipseObject = new EllipseObject(
            fakeShapeDepedency,
            object.renderer.createElement('rect', 'svg'),
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
        expect(temp.size).toEqual(tempBrush.size);
        expect(temp.id).toEqual(tempBrush.id);        expect(temp.id).toEqual(tempBrush.id);
        expect(temp.origin).toEqual(tempBrush.origin);
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
        const point = {x: 4, y: 8};
        const temp = object.internCollid(point);
        expect(temp).toBe(false);
    });

});

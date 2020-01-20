import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { RectangleObject } from './rectangle-object';

describe('RectangleObject', () => {

    let object: RectangleObject;
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
        object = new RectangleObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('polyline', 'svg'),
            new Color('#fff'),
            new Color('#aff'),
            { x: 0, y: 0 },
            { x: 4, y: 12 },
            12,
            'dhhd',
            15,
        );
    });

    it('should copy the rectangle object ', () => {
        const tempRectangle: RectangleObject = new RectangleObject(
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
        expect(temp.size).toEqual(tempRectangle.size);
        expect(temp.transformMatrix).toEqual(tempRectangle.transformMatrix);
        expect(spy).toHaveBeenCalled();
    });

    it('should update renderer  ', () => {
        const spy = spyOn(object, 'setRenderer');
        object.updateRender();
        expect(spy).toHaveBeenCalled();
    });

});

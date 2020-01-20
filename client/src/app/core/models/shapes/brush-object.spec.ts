import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { BrushObject } from './brush-object';

describe('BrushObject', () => {

    let object: BrushObject;
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
        object = new BrushObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('polyline', 'svg'),
            new Color('#fff'),
            {x: 0, y: 0},
            12,
            'dhhd',
        );
    });

    it('should copy the brush object ', () => {
        const tempBrush: BrushObject = new BrushObject(
            fakeShapeDepedency,
            object.renderer.createElement('polyline', 'svg'),
            object.color,
            object.linePoints[0],
            object.strokeWidth,
            object.textureName,
        );
        const spy = spyOn(object.renderer, 'createElement');
        const temp = object.copyObject();
        expect(temp.color).toEqual(tempBrush.color);
        expect(temp.textureName).toEqual(tempBrush.textureName);
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

});

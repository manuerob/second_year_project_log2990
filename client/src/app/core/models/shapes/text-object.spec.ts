import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { TextObject } from './text-object';

describe('TextObject', () => {

    let object: TextObject;
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
        object = new TextObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('g', 'svg'),
            { x: 0, y: 0 },
            { x: 2, y: 4 },
            new Color('#fff'),
            'mutator',
            'font',
            12,
            'alignment',
        );
    });

    it('should copy the text object ', () => {
        const tempText: TextObject = new TextObject(
            fakeShapeDepedency,
            object.renderer.createElement('image', 'svg'),
            object.origin,
            object.size,
            object.color,
            object.mutator,
            object.font,
            object.fontSize,
            object.alignment,
        );
        const spy = spyOn(object.renderer, 'createElement');
        const spy1 = spyOn(object.renderer, 'appendChild');
        const spy2 = spyOn(object.renderer, 'setAttribute');
        const spy3 = spyOn(object, 'setRenderer');
        const temp = object.copyObject();

        expect(temp.tspanValues).toEqual(tempText.tspanValues);
        expect(temp.size).toEqual(tempText.size);
        expect(temp.padding).toEqual(tempText.padding);
        expect(temp.currentSpanCount).toEqual(tempText.currentSpanCount);
        expect(temp.transformMatrix).toEqual(tempText.transformMatrix);
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('should add to renderer  ', () => {
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

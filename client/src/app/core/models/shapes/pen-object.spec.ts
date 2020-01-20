import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { PenObject } from './pen-object';

describe('PenObject', () => {

    let object: PenObject;
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
        object = new PenObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('g', 'svg'),
            new Color('#fff'),
            { x: 0, y: 0 },
            12,
        );
        object.strokeWidths = [2, 3];
        object.linePoints = [{ x: 2, y: 3 }, { x: 12, y: 25 }, { x: 4, y: 19 }];
    });

    it('should copy the pen object ', () => {
        const tempPen: PenObject = new PenObject(
            fakeShapeDepedency,
            object.renderer.createElement('polyline', 'svg'),
            object.color,
            object.linePoints[0],
            object.strokeWidth,
        );
        const spy = spyOn(object.renderer, 'createElement');
        const temp = object.copyObject();
        expect(temp.color).toEqual(tempPen.color);
        expect(temp.size).toEqual(tempPen.size);
        expect(temp.transformMatrix).toEqual(tempPen.transformMatrix);
        expect(spy).toHaveBeenCalled();
    });

    it('should add to renderer  ', () => {
        const spy = spyOn(object, 'setRenderer');
        object.addToRenderer();
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
        const num = 2;
        const temp = object.lineData(num);
        expect(temp).not.toEqual('');
    });
    it('should end on end called  ', () => {
        const spy = spyOn(object, 'setRenderer');
        object.end();
        expect(spy).toHaveBeenCalled();
    });

});

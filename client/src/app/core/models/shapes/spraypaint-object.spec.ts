import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { SpraypaintObject } from './spraypaint-object';

describe('SpraypaintObject', () => {

    let object: SpraypaintObject;
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
        object = new SpraypaintObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('g', 'svg'),
            new Color('#fff'),
            { x: 0, y: 0 },
            12,
        );
        object.linePoints = [{ x: 1, y: 12 }, { x: 5, y: 15 }, { x: 3, y: 5 }, { x: 5, y: 30 }, ];
        object.transformMatrix = [[1, 0], [0, 1], ];
        object.htmlElement = {} as SVGGraphicsElement;
        fakeShapeDepedency.renderer.createElement('circle', 'svg');
        object.paintScatters = [fakeShapeDepedency.renderer.createElement('circle', 'svg'),
        fakeShapeDepedency.renderer.createElement('circle', 'svg'),
        fakeShapeDepedency.renderer.createElement('circle', 'svg')];
        object.linePointRadiuses = [5, 10, 15];

    });

    it('should update renderer on render called  ', () => {
        const spy1 = spyOn(object, 'updateRender');
        const spy2 = spyOn(object, 'append');
        object.render();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should  add to renderer on addRender called  ', () => {
        const spy = spyOn(object.renderer, 'appendChild');
        object.addToRenderer();
        expect(spy).toHaveBeenCalled();
    });

    it('should update renderer on updateRender called  ', () => {
        const spy1 = spyOn(object, 'setRenderer');
        object.updateRender();
        expect(spy1).toHaveBeenCalled();
    });

    it('should end on end called  ', () => {
        const spy = spyOn(object, 'setRenderer');
        object.end();
        expect(spy).toHaveBeenCalled();
    });

});

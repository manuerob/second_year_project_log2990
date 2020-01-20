import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { STAMPS } from 'src/app/components/attributs/controls/stamp-controls/stamps';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { StampObject } from './stamp-object';

describe('StampObject', () => {

    let object: StampObject;
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
        object = new StampObject(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('image', 'svg'),
            { x: 0, y: 0 },
            12,
            15,
            0,
        );
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

    it('should change the stamp choice  ', () => {
        const stampChoice = 0;
        const temp = object.changeStamp(stampChoice);
        expect(temp).toEqual(STAMPS[stampChoice]);
    });

    it('should change the default stamp choice  ', () => {
        const stampChoice = 15;
        const newStampChoice = object.stampChoice;
        const temp = object.changeStamp(stampChoice);
        expect(temp).toEqual(newStampChoice);
    });
});

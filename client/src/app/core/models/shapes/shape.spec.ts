import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockRendererFactory } from 'src/app/core/mocks/fake-renderer-factory.mock';
import { MockRenderer } from 'src/app/core/mocks/fake-renderer.mock';
import { APPLYCOLOR } from '../../../../../../common/constants/constants';
import { ChangePrimaryColor } from '../../services/command-manager/commands/change-primary-color-command';
import { DrawingService } from '../../services/drawing/drawing.service';
import { ShapeDependencyService } from '../../services/shape-dependency/shape-dependency.service';
import { Color } from '../color';
import { Shape } from './shape';

describe('Shape', () => {

    let object: Shape;
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
        object = new Shape(
            fakeShapeDepedency,
            fakeShapeDepedency.renderer.createElement('polyline', 'svg'),
            new Color('#fff'),
            { x: 0, y: 0 },
            { x: 10, y: 15 },
            12,
            45,
        );
    });

    it('should change Primary color on changePrimaryColor called  ', () => {
        const newColor = new Color('#f1f');
        const spy = spyOn(object, 'setRenderer');
        object.changePrimaryColor(newColor);
        expect(object.color).toEqual(newColor);
        expect(spy).toHaveBeenCalled();
    });

    it('should show a red square on showRedsquare called  ', () => {
        const spy1 = spyOn(object, 'setRenderer');
        const spy2 = spyOn(object.renderer, 'appendChild');

        object.showRedSquare();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should add a command on setListener called with a click  ', () => {
        object.renderer.listen(object.htmlElement, 'click', ($event: MouseEvent) => {
            $event.stopPropagation();
            $event.preventDefault();
            object.activeToolTitle = APPLYCOLOR;
            const command: ChangePrimaryColor = new ChangePrimaryColor(
                object, object.primaryColor,
            );
            const spy1 = spyOn(command, 'execute');
            const spy2 = spyOn(object.commandManager, 'addCommand');

            object.setListener();
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });
    });
});

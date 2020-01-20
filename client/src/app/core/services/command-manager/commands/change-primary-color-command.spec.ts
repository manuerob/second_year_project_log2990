import { Color } from 'src/app/core/models/color';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { ChangePrimaryColor } from './change-primary-color-command';

describe('ChangePrimaryColor', () => {

    let command: ChangePrimaryColor;

    beforeEach(() => {
        command = new ChangePrimaryColor(
            {changePrimaryColor(color: Color): Color { return color as Color; }, } as ShapeAbs,
         {} as Color);
    });

    it('should rotate on execute ', () => {
        const spy = spyOn(command.shape, 'changePrimaryColor');
        const newColor = command.shape.changePrimaryColor(command.currentColor);
        command.execute();
        expect(spy).toHaveBeenCalled();
        expect(command.previousColor).toBe(newColor);
    });

    it('should rotate on undo ', () => {
        const spy = spyOn(command.shape, 'changePrimaryColor');
        command.undo();
        expect(spy).toHaveBeenCalled();
    });

});

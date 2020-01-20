import { Color } from 'src/app/core/models/color';
import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { ChangeSecondaryColor } from './change-secondary-color-command';

describe('ChangePrimaryColor', () => {

    let command: ChangeSecondaryColor;

    beforeEach(() => {
        command = new ChangeSecondaryColor(
            {changeSecondaryColor(color: Color): Color { return color as Color; }, } as ShapeAbs,
         {} as Color);
    });

    it('should rotate on execute ', () => {
        const spy = spyOn(command.shape, 'changeSecondaryColor');
        const newColor = command.shape.changeSecondaryColor(command.currentColor);
        command.execute();
        expect(spy).toHaveBeenCalled();
        expect(command.previousColor).toBe(newColor);
    });

    it('should rotate on undo ', () => {
        const spy = spyOn(command.shape, 'changeSecondaryColor');
        command.undo();
        expect(spy).toHaveBeenCalled();
    });

});

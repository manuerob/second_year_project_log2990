import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { RotateCommand } from './rotate-command';

describe('RotateCommand', () => {

    let command: RotateCommand;

    beforeEach(() => {
        command = new RotateCommand({ rotate(deltaAngle: number, isShifted: boolean = false): void {
            //
        }, } as ShapeAbs, 30, true);
    });

    it('should rotate on execute ', () => {
        const spy = spyOn(command.shape, 'rotate');
        command.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('should rotate on undo ', () => {
        const spy = spyOn(command.shape, 'rotate');
        command.undo();
        expect(spy).toHaveBeenCalled();
    });

});

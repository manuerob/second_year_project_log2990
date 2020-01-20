import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { CreateCommand } from './create-command';

describe('CreateCommand', () => {

    let command: CreateCommand;

    beforeEach(() => {
        command = new CreateCommand({render(): void {
            //
        }, delete(): void {
            //
        }, } as ShapeAbs);
    });

    it('should rotate on execute ', () => {
        const spy = spyOn(command.shape, 'render');
        command.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('should rotate on undo ', () => {
        const spy = spyOn(command.shape, 'delete');
        command.undo();
        expect(spy).toHaveBeenCalled();
    });

});

import { ShapeAbs } from 'src/app/core/models/shapes/shape-abs';
import { DeleteCommand } from './delete-command';

describe('DeleteCommand', () => {

    let command: DeleteCommand;

    beforeEach(() => {
        command = new DeleteCommand({render(): void {
            //
        }, delete(): void {
             //
            }, } as ShapeAbs);
    });

    it('should rotate on execute ', () => {
        const spy = spyOn(command.shape, 'delete');
        command.execute();
        expect(spy).toHaveBeenCalled();
    });

    it('should rotate on undo ', () => {
        const spy = spyOn(command.shape, 'render');
        command.undo();
        expect(spy).toHaveBeenCalled();
    });

});

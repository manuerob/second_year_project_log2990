import { TestBed } from '@angular/core/testing';

import { ShapeAbs } from '../../models/shapes/shape-abs';
import { CommandManagerService } from './command-manager.service';
  // tslint:disable
export default interface ICommand {
  shape: ShapeAbs;
  execute(): void;
  undo(): void;
}

describe('CommandManagerService', () => {
  let service: CommandManagerService;

  beforeEach(() => TestBed.configureTestingModule({
  }));
  beforeEach(() => {
    service = TestBed.get(CommandManagerService);
  });

  it('should be created', () => {
    service = TestBed.get(CommandManagerService);
    expect(service).toBeTruthy();
  });

  it('should initiate properly', () => {
    expect(service.commands.length).toEqual(0);
    expect(service.currentCommandPosition).toEqual(-1);
  });

  it('should initiate properly', () => {
    expect(service.commands.length).toEqual(0);
    expect(service.currentCommandPosition).toEqual(-1);
  });

  it('should add command properly', () => {

    service.currentCommandPosition = 2;
    const length = 4;
    service.commands.length = length;
    const newCommand: ICommand = {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    };
    const spy = spyOn(service.commands, 'splice');
    service.addCommand(newCommand);
    expect(spy).toHaveBeenCalled();
  });

  it('should call undo on all commands', () => {
    service.commands = [{
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }, {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }];
    const spy = spyOn(service.commands[1], 'undo');
    service.undoAll();
    expect(spy).toHaveBeenCalled();
  });

  it('should call execute on all commands', () => {
    service.commands = [{
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }, {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }];
    const spy = spyOn(service.commands[1], 'execute');
    service.redoAll();
    expect(spy).toHaveBeenCalled();
  });

  it('should add command properly', () => {

    service.currentCommandPosition = 2;
    const length = 3;
    service.commands.length = length;
    const newCommand: ICommand = {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    };
    const spy = spyOn(service.commands, 'push');
    service.addCommand(newCommand);
    expect(spy).toHaveBeenCalled();
    expect(service.currentCommandPosition).toEqual(3);
  });

  it('should execute redo command properly', () => {
    service.commands = [{
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }, {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }, {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }];
    service.currentCommandPosition = 1;
    const spy = spyOn(service.commands[2], 'execute');
    service.redo();
    expect(spy).toHaveBeenCalled();
    expect(service.currentCommandPosition).toEqual(2);
  });

  it('should execute undo command properly', () => {
    service.commands = [{
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }, {
      shape: {} as ShapeAbs,
      execute(): void { },
      undo(): void { },
    }];
    service.currentCommandPosition = 1;
    const spy = spyOn(service.commands[1], 'undo');
    service.undo();
    expect(spy).toHaveBeenCalled();
    expect(service.currentCommandPosition).toEqual(0);
  });

  it('should calculate coerce position ', () => {
    const position = 5;
    service.commands.length = 4;
    service.coercePositionValue(position);
    expect(service.coercePositionValue(position)).toEqual(3);
  });

  it('should calculate coerce position ', () => {
    const position = 2;
    service.commands.length = 4;
    service.coercePositionValue(position);
    expect(service.coercePositionValue(position)).toEqual(2);
  });

  it('should calculate coerce position ', () => {
    const position = - 2;
    service.commands.length = 4;
    service.coercePositionValue(position);
    expect(service.coercePositionValue(position)).toEqual(0);
  });

});

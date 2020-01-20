import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/core/models/color';
import { ColorGradientComponent } from './color-gradient.component';

describe('ColorGradientComponent', () => {
  let component: ColorGradientComponent;
  let fixture: ComponentFixture<ColorGradientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorGradientComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const createMouseEvent = (type: string): MouseEvent => {
    const event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      type,
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null,
    );

    return event;
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize spectrum property in constructor', () => {
    expect(component.spectrum).toBeDefined();
  });

  it('should initialize rgba property in constructor', () => {
    expect(component.rgba).toBeDefined();
  });

  it('should reload the canvas after view initializing', () => {
    spyOn(component, 'reloadCanvas');
    component.ngAfterViewInit();
    expect(component.reloadCanvas).toHaveBeenCalled();
  });

  it('should not add shade gradient to canvas when cx is null', () => {
    spyOn(component, 'addShadeGradient');
    component.cx = null;
    component.reloadCanvas();
    expect(component.addShadeGradient).not.toHaveBeenCalled();
  });

  it('should add shade gradient when the canvas is reloaded', () => {
    spyOn(component, 'addShadeGradient');
    component.spectrum = new Color();
    component.reloadCanvas();
    expect(component.addShadeGradient).toHaveBeenCalled();
  });

  it('should calculate the selected color when mouse is down', () => {
    spyOn(component, 'calculateColorInPostion');
    const mouseEvent = createMouseEvent('mousedown');
    component.mouseDownEventHandler(mouseEvent);
    expect(component.calculateColorInPostion).toHaveBeenCalled();
    expect(component.isColorSelection).toBe(true);
  });

  it('should calculate the selected color when mouse moves', () => {
    spyOn(component, 'calculateColorInPostion');
    const mouseEvent = createMouseEvent('mousemove');
    component.mouseDownEventHandler(mouseEvent);
    component.isColorSelection = true;
    component.mouseMoveEventHandler(mouseEvent);
    expect(component.calculateColorInPostion).toHaveBeenCalled();
  });

  it('should not calculate the selected color after mouse up', () => {
    spyOn(component, 'calculateColorInPostion');

    const mouseEvent = createMouseEvent('mousemove');
    component.isColorSelection = true;
    component.mouseMoveEventHandler(mouseEvent);

    const mouseEvent2 = createMouseEvent('mouseup');
    component.mouseUpEventHandler(mouseEvent2);

    expect(component.isColorSelection).toBe(false);

    component.mouseMoveEventHandler(mouseEvent);
    expect(component.calculateColorInPostion).not.toHaveBeenCalledTimes(2);
  });

  it('should not calculate the selected color after mouse up', () => {
    spyOn(component, 'calculateColorInPostion');

    const mouseEvent = createMouseEvent('mousemove');
    component.isColorSelection = true;
    component.mouseMoveEventHandler(mouseEvent);

    expect(component.calculateColorInPostion).toHaveBeenCalled();

    const mouseEvent2 = createMouseEvent('mouseout');
    component.mouseOutEventHandler(mouseEvent2);

    expect(component.isColorSelection).toBe(false);

    expect(component.calculateColorInPostion).not.toHaveBeenCalledTimes(2);
  });
});

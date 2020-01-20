import { TestBed } from '@angular/core/testing';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Color } from 'src/app/core/models/color';
import { ColorService } from './../../core/services/color/color.service';
import { SlideToggleComponent } from './../attributs/controls/slide-toggle/slide-toggle.component';
import { GridSliderComponent } from './../attributs/fixed-attributs/grid-snap/grid-slider/grid-slider.component';
import { GridSnapComponent } from './../attributs/fixed-attributs/grid-snap/grid-snap.component';
import { SnapSliderComponent } from './../attributs/fixed-attributs/grid-snap/snap-slider/snap-slider.component';
import { ColorPickerService } from './color-picker.service';

describe('ColorPickerService', () => {
  let colorPickerService: ColorPickerService;
  const newColor = new Color('#fff444');
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [GridSnapComponent, GridSliderComponent, SlideToggleComponent, SnapSliderComponent],
      imports: [MatSlideToggleModule],
providers: [ColorService],
    }),
  );

  beforeEach(() => (colorPickerService = TestBed.get(ColorPickerService)));

  it('should be created', () => {
    expect(colorPickerService).toBeTruthy();
  });

  it('should return proper color', () => {
    colorPickerService.color = newColor;
    expect(colorPickerService.color.getHex()).toEqual('#fff444');
  });

  it('should return and empty array', () => {
    expect(colorPickerService.previousColors.length).toEqual(0);
  });
  it('should return 1 when adding new color from empty array', () => {
    colorPickerService.addNewPreviousColor(newColor);
    expect(colorPickerService.previousColors.length).toEqual(1);
  });
  it('should return new values for the color and the currentColorBase', () => {
    colorPickerService.color = new Color('#eea888');
    colorPickerService.currentColorBase = 'secondary';
    colorPickerService.changeColor(newColor, 'primary');
    expect(colorPickerService.color).toEqual(newColor);
    expect(colorPickerService.currentColorBase).toEqual('primary');
  });

});

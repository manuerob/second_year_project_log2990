import { TestBed } from '@angular/core/testing';

import { Color } from '../../models/color';

import { ColorService } from './color.service';

describe('ColorService', () => {
  const newColor: Color = new Color('#dddddd');
  let colorService: ColorService;
  beforeEach(() => (colorService = TestBed.get(ColorService)));

  it('should be created', () => {
    const service: ColorService = TestBed.get(ColorService);
    expect(service).toBeTruthy();
  });

  it('should return de default value of the color #febfa4 of the primary color', (done: DoneFn) => {
    colorService.primaryColor$.subscribe((color) => {
      expect(color.getHex()).toEqual('#febfa4');
      done();
    });
  });
  it('should return de default value of the color #0b224f of dthe primary color', (done: DoneFn) => {
    colorService.secondaryColor$.subscribe((color) => {
      expect(color.getHex()).toEqual('#0b224f');
      done();
    });
  });

  it('should return the real value of the color or the primary color', () => {
    const color: Color = colorService.primaryColor;
    expect(color.getHex()).toEqual('#febfa4');
  });
  it('should return the real value of the color or the secondary color', () => {
    const color: Color = colorService.secondaryColor;
    expect(color.getHex()).toEqual('#0b224f');
  });

  it('should return the new color for secondary color', () => {
    colorService.secondaryColor = newColor;
    expect(colorService.secondaryColor.getHex()).toEqual('#dddddd');
  });
  it('should return the new color for primary color', () => {
    colorService.primaryColor = newColor;
    expect(colorService.primaryColor.getHex()).toEqual('#dddddd');
  });
});

import { GridService } from './grid.service';

describe('GridService', () => {
  let gridService: GridService;
  beforeEach(() => (gridService = new GridService()));

  it('# get opacity should return the grid opacity attribut', () => {
    expect(gridService.opacity).toBe(gridService.defaultOpacity);
  });

  it('# set opacity should modify the grid opacity attribut correctly', () => {
    const newValue = 10;
    gridService.opacity = newValue;
    expect(gridService.opacity).toBe(newValue);
  });

  it('# get sizeBigsquare should return the grid big square size attribut', () => {
    expect(gridService.sizeBigSquare).toBe(gridService.defaultSizeBigSquare);
  });

  it('# set sizeBigsquare should modify the grid big square size attribut correctly', () => {
    const newBigsizeSquareValue = 80;
    gridService.sizeBigSquare = newBigsizeSquareValue;
    expect(gridService.sizeBigSquare).toBe(newBigsizeSquareValue);
    expect(gridService.dPathBigGrid).toBe(
      `M ${newBigsizeSquareValue} 0 L 0 0 0 ${newBigsizeSquareValue}`,
    );
  });

  it('# get sizeSmallsquare should return the grid big square size attribut', () => {
    expect(gridService.sizeSmallSquare).toBe(
      gridService.defaultSizeSmallSquare,
    );
  });

  it('# set sizeSmallSquare should modify the grid small square size attribut correctly', () => {
    const newsizeSmallSquareValue = 80;
    gridService.sizeSmallSquare = newsizeSmallSquareValue;
    expect(gridService.sizeSmallSquare).toBe(newsizeSmallSquareValue);
    expect(gridService.dPathSmallGrid).toBe(
      `M ${newsizeSmallSquareValue} 0 L 0 0 0 ${newsizeSmallSquareValue}`,
    );
  });

  it('# get showGrid should return the grid showGrid attribut', () => {
    expect(gridService.showGrid).toBe(gridService.defaultShowGrid);
  });

  it('# set showGrid should modify the grid showGrid attribut correctly', () => {
    const newShowGridValue = true;
    gridService.showGrid = newShowGridValue;
    expect(gridService.showGrid).toBe(newShowGridValue);
  });

  it('# toggleShowGrid should modify the grid showGrid attribut correctly', () => {
    const newShowGridValue = true;
    gridService.toggleShowGrid(newShowGridValue);
    expect(gridService.showGrid).toBe(newShowGridValue);
  });
});

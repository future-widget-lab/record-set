import { flatMap } from './flat-map.helper';

describe('Unit | Helper | flatMap', () => {
  it('should exist', () => {
    expect(flatMap).toBeDefined();
  });

  it('should flatMap nested arrays correctly using flatMap', () => {
    const nested = [
      [1, 2],
      [3, 4],
    ];

    const flattened = nested.flatMap((arr) => {
      return arr;
    });

    expect(flattened).toEqual([1, 2, 3, 4]);
  });
});

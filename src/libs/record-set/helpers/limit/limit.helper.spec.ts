import { limit } from './limit.helper';

describe('Unit | Helper | limit', () => {
  it('should exist', () => {
    expect(limit).toBeDefined();
  });

  it('should return the first `count` records', () => {
    const records = [1, 2, 3, 4, 5];

    const actual = limit({ count: 3, records });

    expect(actual).toEqual([1, 2, 3]);
  });

  it('should return empty record set if limit is zero or negative', () => {
    const records = [1, 2, 3];

    expect(limit({ count: 0, records })).toEqual([]);
    expect(limit({ count: -5, records })).toEqual([]);
  });

  it('should return the entire set if limit exceeds length', () => {
    const records = [1, 2, 3];

    const actual = limit({ count: 10, records });

    expect(actual).toEqual([1, 2, 3]);
  });

  it('should return empty record set if called on empty RecordSet', () => {
    const records: Array<any> = [];

    const actual = limit({ count: 3, records });

    expect(actual).toEqual([]);
  });
});

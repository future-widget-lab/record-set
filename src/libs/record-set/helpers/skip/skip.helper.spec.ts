import { skip } from './skip.helper';

describe('Unit | Helper | skip', () => {
  it('should exist', () => {
    expect(skip).toBeDefined();
  });

  it('should skip the specified number of records', () => {
    const records = [1, 2, 3, 4, 5];

    const actual = skip({ count: 2, records });

    expect(actual).toEqual([3, 4, 5]);
  });

  it('should return the same record set when skip is 0 or negative', () => {
    const records = [1, 2, 3];

    expect(skip({ count: 0, records })).toEqual([1, 2, 3]);
    expect(skip({ count: -5, records })).toEqual([1, 2, 3]);
  });

  it('should return an empty record set if skip exceeds length', () => {
    const records = [1, 2, 3];

    const actual = skip({ count: 10, records });

    expect(actual).toEqual([]);
  });

  it('should return an empty record set if called on empty RecordSet', () => {
    const actual = skip({ count: 3, records: [] });

    expect(actual).toEqual([]);
  });
});

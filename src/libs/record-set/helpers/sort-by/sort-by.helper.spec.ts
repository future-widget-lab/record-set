import { sortBy } from './sort-by.helper';
import { pluck } from '../pluck/pluck.helper';

type Person = {
  id: number;
  name: string;
  age: number;
};

const records: Array<Person> = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
  { id: 4, name: 'Bob', age: 40 },
];

describe('Unit | Helper | sortBy', () => {
  it('should exist', () => {
    expect(sortBy).toBeDefined();
  });

  it('should sort ascending by a single key (string)', () => {
    const actual = pluck({
      field: 'age',
      records: sortBy({ iteratees: 'age', records }),
    });

    expect(actual).toEqual([25, 30, 35, 40]);
  });

  it('should sort descending by a single key (string)', () => {
    const actual = pluck({
      field: 'age',
      records: sortBy({ iteratees: 'age', orders: 'desc', records }),
    });

    expect(actual).toEqual([40, 35, 30, 25]);
  });

  it('should sort ascending by multiple keys (array)', () => {
    const actual = sortBy({
      iteratees: ['name', 'age'],
      orders: ['asc', 'asc'],
      records: [
        { name: 'Bob', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Alice', age: 35 },
      ],
    });

    expect(actual).toEqual([
      { name: 'Alice', age: 35 },
      { name: 'Bob', age: 25 },
      { name: 'Bob', age: 30 },
    ]);
  });

  it('should sort by multiple keys with different orders', () => {
    const actual = sortBy({
      iteratees: ['name', 'age'],
      orders: ['asc', 'desc'],
      records: [
        { name: 'Bob', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Alice', age: 35 },
      ],
    });

    expect(actual).toEqual([
      { name: 'Alice', age: 35 },
      { name: 'Bob', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });
});

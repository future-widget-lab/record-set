import { distinct } from './distinct.helper';

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

describe('Unit | Helper | distinct', () => {
  it('should exist', () => {
    expect(distinct).toBeDefined();
  });

  it('should return distinct values correctly using distinct', () => {
    const expectedNames = ['Alice', 'Bob', 'Eve'].sort();
    const actualNames = distinct({ field: 'name', records }).sort();

    expect(actualNames).toEqual(expectedNames);

    const expectedAges = [25, 40].sort();
    const actualAges = distinct({
      field: 'age',
      query: { name: 'Bob' },
      records,
    }).sort();

    expect(actualAges).toEqual(expectedAges);
  });
});

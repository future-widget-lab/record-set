import { pluck } from './pluck.helper';

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

describe('Unit | Helper | pluck', () => {
  it('should exist', () => {
    expect(pluck).toBeDefined();
  });

  it('should extract field values correctly using pluck', () => {
    const expected = [30, 25, 35, 40];

    const actual = pluck({ field: 'age', records });

    expect(actual).toEqual(expected);
  });
});

import { pluck } from '../pluck/pluck.helper';
import { sort } from './sort.helper';

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

describe('Unit | Helper | sort', () => {
  it('should exist', () => {
    expect(sort).toBeDefined();
  });

  it('should sort records correctly using sort', () => {
    const expected = [25, 30, 35, 40];

    const actual = pluck({
      field: 'age',
      records: sort({
        compareFn: (a, b) => {
          return a.age - b.age;
        },
        records,
      }),
    });

    expect(actual).toEqual(expected);
  });
});

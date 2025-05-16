import { reverse } from './reverse.helper';
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

describe('Unit | Helper | reverse', () => {
  it('should exist', () => {
    expect(reverse).toBeDefined();
  });

  it('should reverse records correctly using reverse', () => {
    const expected = [4, 3, 2, 1];

    const actual = pluck({
      key: 'id',
      records: reverse({ records }),
    });

    expect(actual).toEqual(expected);
  });
});

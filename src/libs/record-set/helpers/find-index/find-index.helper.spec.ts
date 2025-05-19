import { findIndex } from './find-index.helper';

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

describe('Unit | Helper | findIndex', () => {
  it('should exist', () => {
    expect(findIndex).toBeDefined();
  });

  it('should find indexes correctly using findIndex', () => {
    let expected = 1;

    let actual = findIndex({ query: { name: 'Bob' }, records });

    expect(actual).toEqual(expected);

    expected = 2;

    actual = findIndex({ query: { age: 35 }, records });

    expect(actual).toEqual(expected);
  });
});

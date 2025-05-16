import { findOne } from './find-one.helper';

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

describe('Unit | Helper | findOne', () => {
  it('should exist', () => {
    expect(findOne).toBeDefined();
  });

  it('should return first when no query is provided using findOne', () => {
    const expected = records[0];

    const actual = findOne({ records });

    expect(actual).toEqual(expected);
  });

  it('should return correct record or null using findOne', () => {
    const expected = records[1];
    let actual = findOne({ query: { name: 'Bob' }, records });

    expect(actual).toEqual(expected);

    actual = findOne({ query: { age: { $gt: 100 } }, records });

    expect(actual).toBeNull();
  });
});

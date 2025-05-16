import { map } from './map.helper';

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

describe('Unit | Helper | map', () => {
  it('should exist', () => {
    expect(map).toBeDefined();
  });

  it('should transform items correctly using map', () => {
    const expected = ['Alice', 'Bob', 'Eve', 'Bob'];

    const actual = records.map((person) => {
      return person.name;
    });

    expect(actual).toEqual(expected);
  });
});

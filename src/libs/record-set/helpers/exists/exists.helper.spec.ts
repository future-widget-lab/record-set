import { exists } from './exists.helper';

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

describe('Unit | Helper | exists', () => {
  it('should exist', () => {
    expect(exists).toBeDefined();
  });

  it('should return correct existence using exists', () => {
    expect(exists({ records })).toBeTruthy();
    expect(exists({ records: [] })).toBeFalsy();
    expect(exists({ query: { age: { $gt: 30 } }, records })).toBeTruthy();
    expect(exists({ query: { age: { $gt: 100 } }, records })).toBeFalsy();
  });
});

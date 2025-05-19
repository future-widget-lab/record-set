import { none } from './none.helper';

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

describe('Unit | Helper | none', () => {
  it('should exist', () => {
    expect(none).toBeDefined();
  });

  it('should return correct existence using none', () => {
    expect(none({ records })).toBeTruthy();
    expect(none({ records: [] })).toBeTruthy();
    expect(none({ query: { age: { $gt: 50 } }, records })).toBeTruthy();
    expect(none({ query: { age: { $gt: 30 } }, records })).toBeFalsy();
  });
});

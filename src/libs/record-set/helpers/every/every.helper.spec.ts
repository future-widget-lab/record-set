import { every } from './every.helper';

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

describe('Unit | Helper | every', () => {
  it('should exist', () => {
    expect(every).toBeDefined();
  });

  it('should return correct existence using every', () => {
    expect(every({ records })).toBeFalsy();
    expect(every({ records: [] })).toBeTruthy();
    expect(every({ query: { age: { $gt: 15 } }, records })).toBeTruthy();
    expect(every({ query: { age: { $gt: 30 } }, records })).toBeFalsy();
  });
});

import { count } from './count.helper';

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

describe('Unit | Helper | count', () => {
  it('should exist', () => {
    expect(count).toBeDefined();
  });

  it('should return correct counts using count', () => {
    expect(count({ records })).toEqual(records.length);

    expect(count({ query: { name: 'Bob' }, records })).toEqual(2);
  });
});

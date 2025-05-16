import { at } from './at.helper';

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

describe('Unit | Helper | at', () => {
  it('should exist', () => {
    expect(at).toBeDefined();
  });

  it('should return correct element or null using at', () => {
    expect(at({ index: 0, records: records })).toEqual(records[0]);

    expect(at({ index: 3, records: records })).toEqual(records[3]);

    expect(at({ index: 4, records: records })).toBeNull();

    expect(at({ index: -1, records: records })).toEqual(
      records[records.length - 1]
    );
  });
});

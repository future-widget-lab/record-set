import { add } from './add.helper';

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

const newRecord = { id: 4, name: 'Susy', age: 28 };

describe('Unit | Helper | add', () => {
  it('should exist', () => {
    expect(add).toBeDefined();
  });

  it('should insert at the end', () => {
    const expected = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Eve', age: 35 },
      { id: 4, name: 'Bob', age: 40 },
      { id: 4, name: 'Susy', age: 28 },
    ];

    let actual = add({ newRecords: newRecord, records });

    expect(actual).toEqual(expected);

    actual = add({ newRecords: newRecord, records, index: 99999 });

    expect(actual).toEqual(expected);
  });

  it('should insert at index 1', () => {
    const expected = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 4, name: 'Susy', age: 28 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Eve', age: 35 },
      { id: 4, name: 'Bob', age: 40 },
    ];

    const actual = add({ newRecords: newRecord, index: 1, records });

    expect(actual).toEqual(expected);
  });
});

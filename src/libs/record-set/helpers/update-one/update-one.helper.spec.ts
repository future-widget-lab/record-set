import { updateOne } from './update-one.helper';

type Person = {
  id: number;
  name: string;
  age: number;
};

const records: Array<Person> = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob 1', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
  { id: 4, name: 'Bob 2', age: 40 },
];

describe('Unit | Helper | updateOne', () => {
  it('should exist', () => {
    expect(updateOne).toBeDefined();
  });

  it('should update records correctly using updateOne', () => {
    const expected = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob 1', age: 31 },
      { id: 3, name: 'Eve', age: 35 },
      { id: 4, name: 'Bob 2', age: 40 },
    ];

    const actual = updateOne({
      records,
      query: {
        name: {$regex: /Bob/i},
      },
      changes: {
        age: 31,
      },
    });

    expect(actual).toEqual(expected);
  });
});

import { update } from './update.helper';

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

describe('Unit | Helper | update', () => {
  it('should exist', () => {
    expect(update).toBeDefined();
  });

  it('should update records correctly using update', () => {
    const expected = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob 1', age: 31 },
      { id: 3, name: 'Eve', age: 35 },
      { id: 4, name: 'Bob 2', age: 31 },
    ];

    const actual = update({
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

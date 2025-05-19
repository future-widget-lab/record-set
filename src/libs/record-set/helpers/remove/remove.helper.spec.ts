import { remove } from './remove.helper';

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

describe('Unit | Helper | remove', () => {
  it('should exist', () => {
    expect(remove).toBeDefined();
  });

  it('should remove records correctly using remove', () => {
    const expected = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 3, name: 'Eve', age: 35 },
    ];

    const actual = remove({
      records,
      query: {
        name: { $regex: /Bob/i },
      },
    });

    expect(actual).toEqual(expected);
  });
});

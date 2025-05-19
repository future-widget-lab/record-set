import { removeOne } from './remove-one.helper';

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

describe('Unit | Helper | reremoveOnemove', () => {
  it('should exist', () => {
    expect(removeOne).toBeDefined();
  });

  it('should remove records correctly using removeOne', () => {
    const expected = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 3, name: 'Eve', age: 35 },
      { id: 4, name: 'Bob 2', age: 40 },
    ];

    const actual = removeOne({
      records,
      query: {
        name: { $regex: /Bob/i },
      },
    });

    expect(actual).toEqual(expected);
  });
});

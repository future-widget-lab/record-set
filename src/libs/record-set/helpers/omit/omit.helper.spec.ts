import { omit } from './omit.helper';

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

describe('Unit | Helper | omit', () => {
  it('should exist', () => {
    expect(omit).toBeDefined();
  });

  it('should remove specified keys correctly using omit', () => {
    const expected = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Eve' },
      { id: 4, name: 'Bob' },
    ];

    const actual = omit({ fields: ['age'], records });

    expect(actual).toEqual(expected);
  });
});

import { find } from './find.helper';

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

describe('Unit | Helper | find', () => {
  it('should exist', () => {
    expect(find).toBeDefined();
  });

  it('should return same instance when no query is provided using find', () => {
    const actual = find({ records });

    expect(actual).toEqual(records);
  });

  it('should filter records correctly using find', () => {
    const expected = [
      { id: 2, name: 'Bob', age: 25 },
      { id: 4, name: 'Bob', age: 40 },
    ];

    const actual = find({ query: { name: 'Bob' }, records });

    expect(actual).toEqual(expected);
  });
});

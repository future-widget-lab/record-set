import { slice } from './slice.helper';

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

describe('Unit | Helper | slice', () => {
  it('should exist', () => {
    expect(slice).toBeDefined();
  });

  it('should retrieves subset correctly', () => {
    let expected = [
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Eve', age: 35 },
    ];

    let actual = slice({ start: 1, end: 3, records });

    expect(actual).toEqual(expected);

    expected = [{ id: 3, name: 'Eve', age: 35 }];

    actual = slice({ start: 2, end: -1, records });

    expect(actual).toEqual(expected);
  });
});

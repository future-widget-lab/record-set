import { last } from './last.helper';

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

describe('Unit | Helper | last', () => {
  it('should exist', () => {
    expect(last).toBeDefined();
  });

  it('should return last or null using last', () => {
    let expected = records[records.length - 1];

    let actual = last({ records });

    expect(actual).toEqual(expected);

    // @ts-expect-error
    expected = null;

    actual = last({ records: [] });

    expect(actual).toEqual(expected);
  });
});

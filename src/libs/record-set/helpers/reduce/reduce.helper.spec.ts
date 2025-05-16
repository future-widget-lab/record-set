import { reduce } from './reduce.helper';

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

describe('Unit | Helper | reduce', () => {
  it('should exist', () => {
    expect(reduce).toBeDefined();
  });

  it('should reduce records correctly using reduce', () => {
    const totalAge = records.reduce((acc, person) => {
      return acc + person.age;
    }, 0);

    expect(totalAge).toEqual(130);
  });
});

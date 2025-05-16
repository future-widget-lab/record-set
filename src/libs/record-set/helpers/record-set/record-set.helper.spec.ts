import { RecordSet } from './record-set.helper';

type Person = {
  id: number;
  name: string;
  age: number;
};

const data: Array<Person> = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
  { id: 4, name: 'Bob', age: 40 },
];

describe('Unit | Integration | RecordSet', () => {
  it('should create an empty record set when undefined is passed', () => {
    const records = RecordSet.of(undefined as any);
    const expectedLength = 0;
    const actualLength = records.length();

    expect(actualLength).toEqual(expectedLength);
    expect(records.isEmpty()).toBeTruthy();

    const expectedArray: Array<Person> = [];
    const actualArray = records.toArray();
    expect(actualArray).toEqual(expectedArray);
  });

  it('should throw an error for non-array input in constructor', () => {
    const construct = () => new (RecordSet as any)(123);

    expect(construct).toThrow(
      /A record set records must be an array. You are seeing this error because a type of \"number\" was passed to the record set constructor./i
    );
  });

  it('should return a shallow copy using toArray', () => {
    const records = RecordSet.of(data);
    const arr1 = records.toArray();
    const arr2 = records.toArray();

    const expected = data;
    expect(arr1).toEqual(expected);
    expect(arr1).not.toBe(arr2);
  });

  it('should return correct length and emptiness using length and isEmpty', () => {
    const records = RecordSet.of(data);

    expect(records.length()).toEqual(data.length);

    expect(records.isEmpty()).toBeFalsy();

    expect(RecordSet.of([]).isEmpty()).toBeTruthy();
  });

  it('should group records correctly using groupBy', () => {
    const records = RecordSet.of(data);
    const grouped = records.groupBy((p) => {
      return p.name;
    });

    expect(grouped.get('Bob')?.toArray()).toEqual([
      { id: 2, name: 'Bob', age: 25 },
      { id: 4, name: 'Bob', age: 40 },
    ]);
    expect(grouped.get('Alice')?.toArray()).toEqual([
      { id: 1, name: 'Alice', age: 30 },
    ]);
  });

  it('should be iterable using for...of', () => {
    const records = RecordSet.of(data);

    const ids: number[] = [];

    const expected = [1, 2, 3, 4];

    for (const item of records) {
      ids.push(item.id);
    }

    expect(ids).toEqual(expected);
  });
});

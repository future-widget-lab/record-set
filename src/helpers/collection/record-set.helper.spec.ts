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

describe('Unit | Heler | RecordSet', () => {
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

  it('should return correct element or null using at', () => {
    const records = RecordSet.of(data);

    expect(records.at(0)).toEqual(data[0]);
    expect(records.at(3)).toEqual(data[3]);
    expect(records.at(4)).toBeNull();
    expect(records.at(-1)).toEqual(data[data.length - 1]);
  });

  it('should return first and last element or null using first and last', () => {
    const records = RecordSet.of(data);
    const expectedHead = data[0];
    const actualHead = records.first();
    expect(actualHead).toEqual(expectedHead);

    const expectedTail = data[data.length - 1];
    const actualTail = records.last();
    expect(actualTail).toEqual(expectedTail);

    const empty = RecordSet.of([]);
    expect(empty.first()).toBeNull();
    expect(empty.last()).toBeNull();
  });

  it('should return correct length and emptiness using length and isEmpty', () => {
    const records = RecordSet.of(data);

    expect(records.length()).toEqual(data.length);

    expect(records.isEmpty()).toBeFalsy();

    expect(RecordSet.of([]).isEmpty()).toBeTruthy();
  });

  it('should return same instance when no query is provided using find', () => {
    const records = RecordSet.of(data);

    const actual = records.find();

    expect(actual).toEqual(records);
  });

  it('should filter records correctly using find', () => {
    const records = RecordSet.of(data);

    const expected = [
      { id: 2, name: 'Bob', age: 25 },
      { id: 4, name: 'Bob', age: 40 },
    ];

    const actual = records.find({ name: 'Bob' }).toArray();

    expect(actual).toEqual(expected);
  });

  it('should return first when no query is provided using findOne', () => {
    const records = RecordSet.of(data);

    const expected = data[0];
    const actual = records.findOne();

    expect(actual).toEqual(expected);
  });

  it('should return correct record or null using findOne', () => {
    const records = RecordSet.of(data);
    const expectedMatch = data[1];
    const actualMatch = records.findOne({ name: 'Bob' });
    expect(actualMatch).toEqual(expectedMatch);

    const actualMiss = records.findOne({ age: { $gt: 100 } });
    expect(actualMiss).toBeNull();
  });

  it('should return correct counts using count', () => {
    const records = RecordSet.of(data);

    const expectedTotal = data.length;
    expect(records.count()).toEqual(expectedTotal);

    const expectedFiltered = 2;
    expect(records.count({ name: 'Bob' })).toEqual(expectedFiltered);
  });

  it('should return correct existence using exists', () => {
    const records = RecordSet.of(data);

    expect(records.exists()).toBeTruthy();
    expect(RecordSet.of([]).exists()).toBeFalsy();
    expect(records.exists({ age: { $gt: 30 } })).toBeTruthy();
    expect(records.exists({ age: { $gt: 100 } })).toBeFalsy();
  });

  it('should return distinct values correctly using distinct', () => {
    const records = RecordSet.of(data);

    const expectedNames = ['Alice', 'Bob', 'Eve'].sort();
    const actualNames = records.distinct('name').sort();
    expect(actualNames).toEqual(expectedNames);

    const expectedAges = [25, 40].sort();
    const actualAges = records.distinct('age', { name: 'Bob' }).sort();
    expect(actualAges).toEqual(expectedAges);
  });

  it('should transform items correctly using map', () => {
    const records = RecordSet.of(data);

    const expected = ['Alice', 'Bob', 'Eve', 'Bob'];

    const actual = records.map((p) => p.name).toArray();

    expect(actual).toEqual(expected);
  });

  it('should reduce records correctly using reduce', () => {
    const records = RecordSet.of(data);

    const totalAge = records.reduce((acc, person) => {
      return acc + person.age;
    }, 0);

    expect(totalAge).toEqual(130);
  });

  it('should flatMap nested arrays correctly using flatMap', () => {
    const nested = RecordSet.of<Array<number>>([[1, 2], [3, 4]]);

    const flattened = nested.flatMap((arr) => {
      return arr;
    });

    expect(flattened.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('should extract field values correctly using pluck', () => {
    const records = RecordSet.of(data);

    const expected = [30, 25, 35, 40];

    const actual = records.pluck('age');

    expect(actual).toEqual(expected);
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

  it('should reverse records correctly using reverse', () => {
    const records = RecordSet.of(data);

    const expected = [4, 3, 2, 1];

    const actual = records.reverse().pluck('id');

    expect(actual).toEqual(expected);
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

  it('should select specified keys correctly using pick', () => {
    const records = RecordSet.of(data);

    const expected = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Eve' },
      { id: 4, name: 'Bob' },
    ];

    const actual = records.pick(['id', 'name']).toArray();

    expect(actual).toEqual(expected);
  });

  it('should remove specified keys correctly using omit', () => {
    const records = RecordSet.of(data);

    const expected = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Eve' },
      { id: 4, name: 'Bob' },
    ];

    const actual = records.omit(['age']).toArray();

    expect(actual).toEqual(expected);
  });

  it('should sort records correctly using sort', () => {
    const records = RecordSet.of(data);

    const expected = [25, 30, 35, 40];

    const actual = records
      .sort((a, b) => {
        return a.age - b.age;
      })
      .pluck('age');

    expect(actual).toEqual(expected);
  });

  it('should sort ascending by a single key (string)', () => {
    const records = RecordSet.of(data);

    const actual = records.sortBy('age').pluck('age');

    expect(actual).toEqual([25, 30, 35, 40]);
  });

  it('should sort descending by a single key (string)', () => {
    const records = RecordSet.of(data);

    const actual = records.sortBy('age', 'desc').pluck('age');

    expect(actual).toEqual([40, 35, 30, 25]);
  });

  it('should sort ascending by multiple keys (array)', () => {
    const multiData = RecordSet.of([
      { name: 'Bob', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Alice', age: 35 },
    ]);

    const actual = multiData.sortBy(['name', 'age'], ['asc', 'asc']).toArray();

    expect(actual).toEqual([
      { name: 'Alice', age: 35 },
      { name: 'Bob', age: 25 },
      { name: 'Bob', age: 30 },
    ]);
  });

  it('should sort by multiple keys with different orders', () => {
    const multiData = RecordSet.of([
      { name: 'Bob', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Alice', age: 35 },
    ]);
    const actual = multiData.sortBy(['name', 'age'], ['asc', 'desc']).toArray();

    expect(actual).toEqual([
      { name: 'Alice', age: 35 },
      { name: 'Bob', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });
});

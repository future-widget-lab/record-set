import { Collection } from './collection.helper';

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

describe('Unit | Heler | Collection', () => {
  it('should create an empty collection when undefined is passed', () => {
    const col = Collection.from(undefined as any);
    const expectedLength = 0;
    const actualLength = col.length();

    expect(actualLength).toEqual(expectedLength);
    expect(col.isEmpty()).toBeTruthy();

    const expectedArray: Array<Person> = [];
    const actualArray = col.toArray();
    expect(actualArray).toEqual(expectedArray);
  });

  it('should throw an error for non-array input in constructor', () => {
    const construct = () => new (Collection as any)(123);

    expect(construct).toThrow(/Collection records must be an array/);
  });

  it('should return a shallow copy using toArray', () => {
    const col = Collection.from(data);
    const arr1 = col.toArray();
    const arr2 = col.toArray();

    const expected = data;
    expect(arr1).toEqual(expected);
    expect(arr1).not.toBe(arr2);
  });

  it('should return correct element or null using at', () => {
    const col = Collection.from(data);

    expect(col.at(0)).toEqual(data[0]);
    expect(col.at(3)).toEqual(data[3]);
    expect(col.at(4)).toBeNull();
    expect(col.at(-1)).toBeNull();
  });

  it('should return first and last element or null using head and tail', () => {
    const col = Collection.from(data);
    const expectedHead = data[0];
    const actualHead = col.head();
    expect(actualHead).toEqual(expectedHead);

    const expectedTail = data[data.length - 1];
    const actualTail = col.tail();
    expect(actualTail).toEqual(expectedTail);

    const empty = Collection.from([]);
    expect(empty.head()).toBeNull();
    expect(empty.tail()).toBeNull();
  });

  it('should return correct length and emptiness using length and isEmpty', () => {
    const col = Collection.from(data);

    expect(col.length()).toEqual(data.length);

    expect(col.isEmpty()).toBeFalsy();

    expect(Collection.from([]).isEmpty()).toBeTruthy();
  });

  it('should return same instance when no query is provided using find', () => {
    const col = Collection.from(data);

    const actual = col.find();

    expect(actual).toEqual(col);
  });

  it('should filter records correctly using find', () => {
    const col = Collection.from(data);

    const expected = [
      { id: 2, name: 'Bob', age: 25 },
      { id: 4, name: 'Bob', age: 40 },
    ];

    const actual = col.find({ name: 'Bob' }).toArray();

    expect(actual).toEqual(expected);
  });

  it('should return head when no query is provided using findOne', () => {
    const col = Collection.from(data);

    const expected = data[0];
    const actual = col.findOne();

    expect(actual).toEqual(expected);
  });

  it('should return correct record or null using findOne', () => {
    const col = Collection.from(data);
    const expectedMatch = data[1];
    const actualMatch = col.findOne({ name: 'Bob' });
    expect(actualMatch).toEqual(expectedMatch);

    const actualMiss = col.findOne({ age: { $gt: 100 } });
    expect(actualMiss).toBeNull();
  });

  it('should return correct counts using count', () => {
    const col = Collection.from(data);

    const expectedTotal = data.length;
    expect(col.count()).toEqual(expectedTotal);

    const expectedFiltered = 2;
    expect(col.count({ name: 'Bob' })).toEqual(expectedFiltered);
  });

  it('should return correct existence using exists', () => {
    const col = Collection.from(data);

    expect(col.exists()).toBeTruthy();
    expect(Collection.from([]).exists()).toBeFalsy();
    expect(col.exists({ age: { $gt: 30 } })).toBeTruthy();
    expect(col.exists({ age: { $gt: 100 } })).toBeFalsy();
  });

  it('should return distinct values correctly using distinct', () => {
    const col = Collection.from(data);

    const expectedNames = ['Alice', 'Bob', 'Eve'].sort();
    const actualNames = col.distinct('name').sort();
    expect(actualNames).toEqual(expectedNames);

    const expectedAges = [25, 40].sort();
    const actualAges = col.distinct('age', { name: 'Bob' }).sort();
    expect(actualAges).toEqual(expectedAges);
  });

  it('should transform items correctly using map', () => {
    const col = Collection.from(data);

    const expected = ['Alice', 'Bob', 'Eve', 'Bob'];

    const actual = col.map((p) => p.name).toArray();

    expect(actual).toEqual(expected);
  });

  it('should extract field values correctly using pluck', () => {
    const col = Collection.from(data);

    const expected = [30, 25, 35, 40];

    const actual = col.pluck('age');

    expect(actual).toEqual(expected);
  });

  it('should select specified keys correctly using pick', () => {
    const col = Collection.from(data);

    const expected = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Eve' },
      { id: 4, name: 'Bob' },
    ];

    const actual = col.pick(['id', 'name']).toArray();

    expect(actual).toEqual(expected);
  });

  it('should remove specified keys correctly using omit', () => {
    const col = Collection.from(data);

    const expected = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Eve' },
      { id: 4, name: 'Bob' },
    ];

    const actual = col.omit(['age']).toArray();

    expect(actual).toEqual(expected);
  });

  it('should sort records correctly using sort', () => {
    const col = Collection.from(data);

    const expected = [25, 30, 35, 40];

    const actual = col
      .sort((a, b) => {
        return a.age - b.age;
      })
      .pluck('age');

    expect(actual).toEqual(expected);
  });

  it('should reverse records correctly using reverse', () => {
    const col = Collection.from(data);

    const expected = [4, 3, 2, 1];

    console.info(col.reverse().pluck('id'));

    const actual = col.reverse().pluck('id');

    expect(actual).toEqual(expected);
  });

  it('should be iterable using for...of', () => {
    const col = Collection.from(data);

    const ids: number[] = [];

    const expected = [1, 2, 3, 4];

    for (const item of col) {
      ids.push(item.id);
    }

    expect(ids).toEqual(expected);
  });
});

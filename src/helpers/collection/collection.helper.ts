import sift from 'sift';
import type { Query } from 'sift';
import orderBy from 'lodash.orderby';
import uniqBy from 'lodash.uniqby';
import { CollectionApi } from '../../types/collection.type';

export class Collection<TRecord> implements CollectionApi<TRecord> {
  private readonly records: Array<TRecord>;

  static of<TRecord>(records?: Array<TRecord>): Collection<TRecord> {
    return new Collection(records);
  }

  private constructor(records: Array<TRecord> = []) {
    if (!Array.isArray(records)) {
      throw new Error(
        `A collection records must be an array. You are seeing this error because a type of "${typeof records}" was passed to the collection constructor.`
      );
    }

    this.records = records || [];
    this.toArray = this.toArray.bind(this);
    this.at = this.at.bind(this);
    this.head = this.head.bind(this);
    this.tail = this.tail.bind(this);
    this.length = this.length.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.find = this.find.bind(this);
    this.findOne = this.findOne.bind(this);
    this.count = this.count.bind(this);
    this.exists = this.exists.bind(this);
    this.distinct = this.distinct.bind(this);
    this.map = this.map.bind(this);
    this.pluck = this.pluck.bind(this);
    this.pick = this.pick.bind(this);
    this.omit = this.omit.bind(this);
    this.sort = this.sort.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.reverse = this.reverse.bind(this);
  }

  public [Symbol.iterator](): Iterator<TRecord> {
    return this.records[Symbol.iterator]();
  }

  /**
   * @method
   * @description
   * Use this method to get a shallow-copied array of all records in the store.
   * @example
   * const col = Collection.of([{ id: 1 }, { id: 2 }]);
   *
   * col.toArray(); // [{ id: 1 }, { id: 2 }]
   */
  public toArray(): Array<TRecord> {
    return ([] as Array<TRecord>).concat(this.records);
  }

  /**
   * @method
   * @description
   * Use this method to retrieve the record at the specified index, or null if out of bounds.
   * @example
   * const col = Collection.of([{ id: 1 }, { id: 2 }]);
   *
   * col.at(0); // { id: 1 }
   *
   * col.at(5); // null
   */
  public at(index: number): TRecord | null {
    return this.records.at(index) ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the first record in the store, or null if the store is empty.
   * @example
   * const col = Collection.of([{ id: 1 }, { id: 2 }]);
   *
   * col.head(); // { id: 1 }
   *
   * Collection.of([]).head(); // null
   */
  public head(): TRecord | null {
    return this.records[0] ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the last record in the store, or null if the store is empty.
   * @example
   * const col = Collection.of([{ id: 1 }, { id: 2 }]);
   *
   * col.tail(); // { id: 2 }
   *
   * Collection.of([]).tail(); // null
   */
  public tail(): TRecord | null {
    return this.records[this.records.length - 1] ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the number of records in the store.
   * @example
   * const col = Collection.of([1, 2, 3]);
   *
   * col.length(); // 3
   */
  public length(): number {
    return this.records.length;
  }

  /**
   * @method
   * @description
   * Use this method to determine whether the store contains any records.
   * @example
   * Collection.of([]).isEmpty(); // true
   *
   * Collection.of([1]).isEmpty(); // false
   */
  public isEmpty(): boolean {
    return this.records.length === 0;
  }

  /**
   * @method
   * @description
   * Use this method to find all the matching records given a query.
   *
   * Fallsback to the the same set of records if no `query` is provided.
   * @example
   * type Example { a: number }
   *
   * const col = Collection.of<Example>([{ a: 1 }, { a: 2 }]);
   *
   * col.find({ a: 2 }).toArray(); // [{ a: 2 }]
   *
   * col.find().toArray(); // same as original
   */
  public find(query?: Query<TRecord>): Collection<TRecord> {
    if (!query) {
      return this;
    }

    return Collection.of(this.records.filter(sift(query)));
  }

  /**
   * @method
   * @description
   * Use this method to find the first matching record given a query.
   *
   * Defaults to the first element if no `query` is provided.
   *
   * Fallbacks to `null` if the query provided does not return any matches.
   * @example
   * const col = Collection.of([{ x: 1 }, { x: 2 }]);
   *
   * col.findOne({ x: 2 }); // { x: 2 }
   *
   * col.findOne({ x: 3 }); // null
   *
   * col.findOne(); // { x: 1 }
   */
  public findOne(query?: Query<TRecord>): TRecord | null {
    if (!query) {
      return this.head();
    }

    return this.records.find(sift(query)) ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to count the number of records matching the query.
   * @example
   * const col = Collection.of([{ b: 1 }, { b: 2 }, { b: 2 }]);
   *
   * col.count({ b: 2 }); // 2
   *
   * col.count(); // 3
   */
  public count(query?: Query<TRecord>): number {
    if (!query) {
      return this.length();
    }

    return this.records.filter(sift(query)).length;
  }

  /**
   * @method
   * @description
   * Use this method to check if any record exists matching the query.
   * @example
   * const col = Collection.of([{ c: 3 }]);
   *
   * col.exists({ c: 3 }); // true
   *
   * col.exists({ c: 4 }); // false
   *
   * col.exists(); // true if not empty
   */
  public exists(query?: Query<TRecord>): boolean {
    if (!query) {
      return !this.isEmpty();
    }

    return this.records.some(sift(query));
  }

  /**
   * @method
   * @description
   * Use this method to get distinct values of a field among records matching the query.
   * @example
   * const col = Collection.of([{ v: 1 }, { v: 2 }, { v: 1 }]);
   *
   * col.distinct('v'); // [1, 2]
   */
  public distinct(field: keyof TRecord, query?: Query<TRecord>): Array<any> {
    const filteredItems = query
      ? this.records.filter(sift(query))
      : this.records;

    const uniqueItems = uniqBy(filteredItems, field as string);

    return uniqueItems.map((item) => {
      return item[field];
    });
  }

  /**
   * @method
   * @description
   * Use this method to transform all records in the store and return a new Collection of the transformed records.
   * @example
   * const col = Collection.of([{ n: 1 }, { n: 2 }]);
   *
   * const doubled = col.map(x => ({ n: x.n * 2 }));
   *
   * doubled.toArray(); // [{ n: 2 }, { n: 4 }]
   */
  public map<TMappedRecord>(
    fn: (item: TRecord) => TMappedRecord
  ): Collection<TMappedRecord> {
    const records: Array<TMappedRecord> = [];

    for (const item of this.records) {
      records.push(fn(item));
    }

    return new Collection(records);
  }

  /**
   * @method
   * @description
   * Use this method to extract an array of a single field's values from all records in the store.
   * @example
   * const col = Collection.of([{ a: 1 }, { a: 2 }]);
   *
   * col.pluck('a'); // [1, 2]
   */
  public pluck<TKey extends keyof TRecord>(key: TKey): Array<TRecord[TKey]> {
    const records: Array<TRecord[TKey]> = [];

    for (const item of this.records) {
      records.push(item[key]);
    }

    return records;
  }

  /**
   * @method
   * @description
   * Use this method to pick only the specified fields from each record, returning a new Collection of records with only those keys.
   * @example
   * const col = Collection.of([{ x: 1, y: 2 }]);
   *
   * col.pick(['x']).toArray(); // [{ x: 1 }]
   */
  public pick<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): Collection<Pick<TRecord, TKey>> {
    const picked: Array<Pick<TRecord, TKey>> = [];

    for (const item of this.records) {
      const pickObj = {} as Pick<TRecord, TKey>;

      for (const field of fields) {
        // @ts-expect-error
        if (field in item) {
          pickObj[field] = item[field];
        }
      }

      picked.push(pickObj);
    }

    return Collection.of(picked);
  }

  /**
   * @method
   * @description
   * Use this method to omit the specified fields from each record, returning a new Collection of records without those keys.
   * @example
   * const col = Collection.of([{ x: 1, y: 2 }]);
   *
   * col.omit(['y']).toArray(); // [{ x: 1 }]
   */
  public omit<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): Collection<Omit<TRecord, TKey>> {
    const omitted: Array<Omit<TRecord, TKey>> = [];

    for (const item of this.records) {
      const omitObj = { ...item } as Omit<TRecord, TKey>;

      for (const field of fields) {
        if (field in omitObj) {
          // @ts-expect-error
          delete omitObj[field];
        }
      }

      omitted.push(omitObj);
    }

    return Collection.of(omitted);
  }

  /**
   * @method
   * @description
   * Use this method to sort the records with the provided compare function.
   * @example
   * const col = Collection.of([{ n: 2 },{ n: 1 }]);
   *
   * col.sort((a,b) => {
   *    return a.n - b.n
   * })
   * .pluck('n')
   * .toArray(); // [1,2]
   */
  public sort(
    compareFn: (a: TRecord, b: TRecord) => number
  ): Collection<TRecord> {
    return new Collection(
      ([] as Array<TRecord>).concat(this.records).sort(compareFn)
    );
  }

  /**
   * @method
   * @description
   * Use this method to sort the records by key(s) using lodash orderBy.
   * @example
   * const col = Collection.of([{ a:1, b:2 },{ a:1, b:1 }]);
   *
   * col.sortBy('b').pluck('b'); // [1, 2]
   *
   * col.sortBy('b','desc').pluck('b'); // [2, 1]
   *
   * col.sortBy(['a', 'b'], ['asc', 'desc']).toArray(); // sorted by a ascending, then b descending
   */
  public sortBy(
    iteratees: Array<keyof TRecord> | keyof TRecord,
    orders?: Array<'asc' | 'desc'> | 'asc' | 'desc'
  ): Collection<TRecord> {
    const keys = Array.isArray(iteratees)
      ? iteratees.map(String)
      : [String(iteratees)];

    const ords =
      orders === undefined
        ? keys.map(() => 'asc')
        : Array.isArray(orders)
        ? orders
        : [orders];

    const sorted = orderBy(
      this.records,
      keys as (keyof TRecord & string)[],
      ords as Array<'asc' | 'desc'>
    );

    return new Collection(sorted);
  }

  /**
   * @method
   * @description
   * Use this method reverse the order of the records.
   * @example
   * const col = Collection.of([1, 2, 3]);
   *
   * col.reverse().toArray(); // [3, 2, 1]
   */
  public reverse(): Collection<TRecord> {
    return new Collection(
      ([] as Array<TRecord>).concat(this.records).reverse()
    );
  }
}

import sift from 'sift';
import type { Query } from 'sift';
import orderBy from 'lodash.orderby';
import uniqBy from 'lodash.uniqby';
import { RecordSetApi } from '../../types/record-set.type';

export class RecordSet<TRecord> implements RecordSetApi<TRecord> {
  private readonly records: Array<TRecord>;

  static of<TRecord>(records?: Array<TRecord>): RecordSet<TRecord> {
    return new RecordSet(records);
  }

  private constructor(records: Array<TRecord> = []) {
    if (!Array.isArray(records)) {
      throw new Error(
        `A record set records must be an array. You are seeing this error because a type of "${typeof records}" was passed to the record set constructor.`
      );
    }

    this.records = records || [];
    this.toArray = this.toArray.bind(this);
    this.at = this.at.bind(this);
    this.first = this.first.bind(this);
    this.last = this.last.bind(this);
    this.skip = this.skip.bind(this);
    this.limit = this.limit.bind(this);
    this.length = this.length.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.find = this.find.bind(this);
    this.findOne = this.findOne.bind(this);
    this.count = this.count.bind(this);
    this.exists = this.exists.bind(this);
    this.distinct = this.distinct.bind(this);
    this.map = this.map.bind(this);
    this.reduce = this.reduce.bind(this);
    this.flatMap = this.flatMap.bind(this);
    this.pluck = this.pluck.bind(this);
    this.pick = this.pick.bind(this);
    this.omit = this.omit.bind(this);
    this.sort = this.sort.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.groupBy = this.groupBy.bind(this);
    this.reverse = this.reverse.bind(this);
  }

  public [Symbol.iterator](): Iterator<TRecord> {
    return this.records[Symbol.iterator]();
  }

  /**
   * @method
   * @description
   * Use this method to get a shallow-copied array of all records in the record set.
   *
   * @example
   * const record = RecordSet.of([{ id: 1 }, { id: 2 }]);
   *
   * record.toArray(); // [{ id: 1 }, { id: 2 }]
   */
  public toArray(): Array<TRecord> {
    return ([] as Array<TRecord>).concat(this.records);
  }

  /**
   * @method
   * @description
   * Use this method to retrieve the record at the specified index, or null if out of bounds.
   *
   * @example
   * const record = RecordSet.of([{ id: 1 }, { id: 2 }]);
   *
   * record.at(0); // { id: 1 }
   *
   * record.at(5); // null
   */
  public at(index: number): TRecord | null {
    return this.records.at(index) ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the first record in the record set, or null if the record set is empty.
   *
   * @example
   * const record = RecordSet.of([{ id: 1 }, { id: 2 }]);
   *
   * record.first(); // { id: 1 }
   *
   * RecordSet.of([]).first(); // null
   */
  public first(): TRecord | null {
    return this.records[0] ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the last record in the record set, or null if the record set is empty.
   *
   * @example
   * const record = RecordSet.of([{ id: 1 }, { id: 2 }]);
   *
   * record.last(); // { id: 2 }
   *
   * RecordSet.of([]).last(); // null
   */
  public last(): TRecord | null {
    return this.records[this.records.length - 1] ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to skip the first `count` records and return a new record set with the remaining records.
   *
   * Falls back to the same set of records if no `query` is provided.
   *
   * @example
   * const records = RecordSet.of([1, 2, 3, 4, 5]);
   *
   * const skipped = records.skip(2);
   *
   * console.log(skipped.toArray()); // [3, 4, 5]
   */
  public skip(count: number): RecordSet<TRecord> {
    if (count <= 0) {
      return this;
    }

    return new RecordSet(this.records.slice(count));
  }

  /**
   * @method
   * @description
   * Use this method to take at most `count` records from the start of the record set.
   *
   * @example
   * const records = RecordSet.of([1, 2, 3, 4, 5]);
   *
   * const limited = records.limit(3);
   * console.log(limited.toArray()); // [1, 2, 3]
   */
  public limit(count: number): RecordSet<TRecord> {
    if (count < 0) {
      return new RecordSet([] as Array<TRecord>);
    }

    if (count === 0) {
      return new RecordSet([] as Array<TRecord>);
    }

    return new RecordSet(this.records.slice(0, count));
  }

  /**
   * @method
   * @description
   * Use this method to get the number of records in the record set.
   *
   * @example
   * const record = RecordSet.of([1, 2, 3]);
   *
   * record.length(); // 3
   */
  public length(): number {
    return this.records.length;
  }

  /**
   * @method
   * @description
   * Use this method to determine whether the record set contains any records.
   *
   * @example
   * RecordSet.of([]).isEmpty(); // true
   *
   * RecordSet.of([1]).isEmpty(); // false
   */
  public isEmpty(): boolean {
    return this.records.length === 0;
  }

  /**
   * @method
   * @description
   * Use this method to find all the matching records given a query.
   *
   * Falls back to the same set of records if no `query` is provided.
   *
   * @example
   * type Person = { id: number; name: string; age: number };
   *
   * const people = RecordSet.of<Person>([
   *   { id: 1, name: 'Alice', age: 30 },
   *   { id: 2, name: 'Bob', age: 25 },
   *   { id: 3, name: 'Eve', age: 35 },
   * ]);
   *
   * // Find all people named 'Bob'
   * const bobs = people.find({ name: 'Bob' });
   * console.log(bobs.toArray()); // [{ id: 2, name: 'Bob', age: 25 }]
   *
   * // Calling find without a query returns the full record set
   * const all = people.find();
   * console.log(all.toArray()); // same as people.toArray()
   */
  public find(query?: Query<TRecord>): RecordSet<TRecord> {
    if (!query) {
      return this;
    }

    return RecordSet.of(this.records.filter(sift(query)));
  }

  /**
   * @method
   * @description
   * Use this method to find the first matching record given a query.
   *
   * Defaults to the first element if no `query` is provided.
   *
   * Fallbacks to `null` if the query provided does not return any matches.
   *
   * @example
   * type Person = { id: number; name: string; age: number };
   *
   * const people = RecordSet.of<Person>([
   *   { id: 1, name: 'Alice', age: 30 },
   *   { id: 2, name: 'Bob', age: 25 },
   * ]);
   *
   * const bob = people.findOne({ name: 'Bob' });
   * console.log(bob); // { id: 2, name: 'Bob', age: 25 }
   *
   * const nonExistent = people.findOne({ name: 'Eve' });
   * console.log(nonExistent); // null
   *
   * const firstPerson = people.findOne();
   * console.log(firstPerson); // { id: 1, name: 'Alice', age: 30 }
   */
  public findOne(query?: Query<TRecord>): TRecord | null {
    if (!query) {
      return this.first();
    }

    return this.records.find(sift(query)) ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to count the number of records matching the query.
   *
   * @example
   * type Item = { category: string; value: number };
   *
   * const items = RecordSet.of<Item>([
   *   { category: 'fruit', value: 10 },
   *   { category: 'fruit', value: 20 },
   *   { category: 'vegetable', value: 15 },
   * ]);
   *
   * const fruitCount = items.count({ category: 'fruit' });
   * console.log(fruitCount); // 2
   *
   * const totalCount = items.count();
   * console.log(totalCount); // 3
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
   *
   * @example
   * type Item = { type: string; available: boolean };
   *
   * const items = RecordSet.of<Item>([
   *   { type: 'book', available: true },
   * ]);
   *
   * const hasBook = items.exists({ type: 'book' });
   * console.log(hasBook); // true
   *
   * const hasMagazine = items.exists({ type: 'magazine' });
   * console.log(hasMagazine); // false
   *
   * const hasAny = items.exists();
   * console.log(hasAny); // true, because record set is not empty
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
   *
   * @example
   * type Product = { category: string; name: string };
   *
   * const products = RecordSet.of<Product>([
   *   { category: 'fruit', name: 'apple' },
   *   { category: 'vegetable', name: 'carrot' },
   *   { category: 'fruit', name: 'banana' },
   * ]);
   *
   * const categories = products.distinct('category');
   * console.log(categories); // ['fruit', 'vegetable']
   *
   * const fruitNames = products.distinct('name', { category: 'fruit' });
   * console.log(fruitNames); // ['apple', 'banana']
   */
  public distinct(field: keyof TRecord, query?: Query<TRecord>): Array<any> {
    const filteredItems = query
      ? this.records.filter(sift(query))
      : this.records;

    const uniqueItems = uniqBy(filteredItems, field as string);

    return uniqueItems.map((record) => {
      return record[field];
    });
  }

  /**
   * @method
   * @description
   * Use this method to transform all records in the record set and return a new RecordSet of the transformed records.
   *
   * @example
   * type User = { id: number; name: string; age: number };
   *
   * const users = RecordSet.of<User>([
   *   { id: 1, name: 'Alice', age: 30 },
   *   { id: 2, name: 'Bob', age: 25 },
   * ]);
   *
   * // Create a record set of user names
   * const userNames = users.map(user => {
   *   return user.name;
   * });
   *
   * console.log(userNames.toArray()); // ['Alice', 'Bob']
   */
  public map<TMappedRecord>(
    fn: (record: TRecord) => TMappedRecord
  ): RecordSet<TMappedRecord> {
    const records: Array<TMappedRecord> = [];

    for (const record of this.records) {
      records.push(fn(record));
    }

    return new RecordSet(records);
  }

  /**
   * @method
   * @description
   * Use this method to map each record to zero or more records, then flatten the results into a single new RecordSet.
   *
   * This is handy for extracting nested arrays or expanding items.
   *
   * @example
   * type Comment = { id: number; text: string };
   *
   * type Post = { id: number; comments: Array<Comment> };
   *
   * const posts = RecordSet.of<Post>([
   *   { id: 1, comments: [{ id: 101, text: 'a' }, { id: 102, text: 'b' }] },
   *   { id: 2, comments: [{ id: 103, text: 'c' }] },
   * ]);
   *
   * const comments = posts.flatMap((post) => {
   *   return post.comments;
   * });
   *
   * comments.toArray(); // [{ id: 101, text: 'a' }, { id: 102, text: 'b' }, { id: 103, text: 'c' }]
   */
  public flatMap<TMappedRecord>(
    fn: (record: TRecord) => Array<TMappedRecord>
  ): RecordSet<TMappedRecord> {
    const result: Array<TMappedRecord> = [];

    for (const record of this.records) {
      const mapped = fn(record);
      // Push all items returned by fn into result
      for (const subItem of mapped) {
        result.push(subItem);
      }
    }

    return new RecordSet(result);
  }

  /**
   * @method
   * @description
   * Use this method to reduce the record set to a single accumulated value.
   *
   * @example
   * type Person = { name: string; age: number };
   *
   * const people = RecordSet.of<Person>([
   *   { name: 'Alice', age: 30 },
   *   { name: 'Bob', age: 25 },
   *   { name: 'Eve', age: 35 },
   * ]);
   *
   * const totalAge = people.reduce((acc, person) => {
   *   return acc + person.age;
   * }, 0);
   *
   * console.log(totalAge); // 90
   */
  public reduce<TAccumulator>(
    fn: (accumulator: TAccumulator, record: TRecord) => TAccumulator,
    initialValue: TAccumulator
  ): TAccumulator {
    let accumulator = initialValue;

    for (const record of this.records) {
      accumulator = fn(accumulator, record);
    }

    return accumulator;
  }

  /**
   * @method
   * @description
   * Use this method to extract an array of a single field's values from all records in the record set.
   *
   * @example
   * type Person = { id: number; name: string; age: number };
   *
   * const people = RecordSet.of<Person>([
   *   { id: 1, name: 'Alice', age: 30 },
   *   { id: 2, name: 'Bob', age: 25 },
   *   { id: 3, name: 'Eve', age: 35 },
   * ]);
   *
   * const ages = people.pluck('age');
   *
   * console.log(ages); // [30, 25, 35]
   */
  public pluck<TKey extends keyof TRecord>(key: TKey): Array<TRecord[TKey]> {
    const records: Array<TRecord[TKey]> = [];

    for (const record of this.records) {
      records.push(record[key]);
    }

    return records;
  }

  /**
   * @method
   * @description
   * Use this method to pick only the specified fields from each record, returning a new RecordSet of records with only those keys.
   *
   * @example
   * type User = { id: number; name: string; age: number; email: string };
   *
   * const users = RecordSet.of<User>([
   *   { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
   *   { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
   * ]);
   *
   * // Pick only id and name fields
   * const userSummaries = users.pick(['id', 'name']);
   *
   * console.log(userSummaries.toArray()); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
   */
  public pick<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): RecordSet<Pick<TRecord, TKey>> {
    const picked: Array<Pick<TRecord, TKey>> = [];

    for (const record of this.records) {
      const pickObj = {} as Pick<TRecord, TKey>;

      for (const field of fields) {
        // @ts-expect-error
        if (field in record) {
          pickObj[field] = record[field];
        }
      }

      picked.push(pickObj);
    }

    return RecordSet.of(picked);
  }

  /**
   * @method
   * @description
   * Use this method to omit the specified fields from each record, returning a new RecordSet of records without those keys.
   *
   * @example
   * type User = { id: number; name: string; age: number; password: string };
   *
   * const users = RecordSet.of<User>([
   *   { id: 1, name: 'Alice', age: 30, password: 'secret1' },
   *   { id: 2, name: 'Bob', age: 25, password: 'secret2' },
   * ]);
   *
   * // Omit the password field for security reasons
   * const safeUsers = users.omit(['password']);
   *
   * console.log(safeUsers.toArray());
   * // [{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 25 }]
   */
  public omit<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): RecordSet<Omit<TRecord, TKey>> {
    const omitted: Array<Omit<TRecord, TKey>> = [];

    for (const record of this.records) {
      const omitObj = { ...record } as Omit<TRecord, TKey>;

      for (const field of fields) {
        if (field in omitObj) {
          // @ts-expect-error
          delete omitObj[field];
        }
      }

      omitted.push(omitObj);
    }

    return RecordSet.of(omitted);
  }

  /**
   * @method
   * @description
   * Use this method to sort the records with the provided compare function.
   *
   * @example
   * type Product = { name: string; price: number };
   *
   * const products = RecordSet.of<Product>([
   *   { name: 'Banana', price: 1.5 },
   *   { name: 'Apple', price: 2.0 },
   *   { name: 'Orange', price: 1.2 },
   * ]);
   *
   * // Sort products by price ascending
   * const sortedProducts = products.sort((a, b) => {
   *   return a.price - b.price;
   * });
   *
   * console.log(sortedProducts.pluck('price')); // [1.2, 1.5, 2.0]
   */
  public sort(
    compareFn: (a: TRecord, b: TRecord) => number
  ): RecordSet<TRecord> {
    return new RecordSet(
      ([] as Array<TRecord>).concat(this.records).sort(compareFn)
    );
  }

  /**
   * @method
   * @description
   * Use this method to sort the records by key(s) using lodash orderBy.
   *
   * @example
   * type Product = { category: string; price: number };
   *
   * const products = RecordSet.of<Product>([
   *   { category: 'fruit', price: 5 },
   *   { category: 'fruit', price: 3 },
   *   { category: 'vegetable', price: 4 },
   * ]);
   *
   * // Sort by price ascending
   * const sortedByPrice = products.sortBy('price');
   * console.log(sortedByPrice.pluck('price')); // [3, 4, 5]
   *
   * // Sort by price descending
   * const sortedByPriceDesc = products.sortBy('price', 'desc');
   * console.log(sortedByPriceDesc.pluck('price')); // [5, 4, 3]
   *
   * // Sort by category ascending, then price descending
   * const sortedByCategoryPrice = products.sortBy(['category', 'price'], ['asc', 'desc']);
   * console.log(sortedByCategoryPrice.toArray());
   * // [
   * //   { category: 'fruit', price: 5 },
   * //   { category: 'fruit', price: 3 },
   * //   { category: 'vegetable', price: 4 }
   * // ]
   */
  public sortBy(
    iteratees: Array<keyof TRecord> | keyof TRecord,
    orders?: Array<'asc' | 'desc'> | 'asc' | 'desc'
  ): RecordSet<TRecord> {
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

    return new RecordSet(sorted);
  }

  /**
   * @method
   * @description
   * Use this method to group records by a key derived from each record.
   *
   * It returns a `Map` where keys are group keys and values are record sets of grouped records.
   * @example
   * type Person = { id: number; name: string; age: number };
   *
   * const people = RecordSet.of<Person>([
   *   { id: 1, name: 'Alice', age: 30 },
   *   { id: 2, name: 'Bob', age: 25 },
   *   { id: 3, name: 'Eve', age: 25 },
   * ]);
   *
   * const grouped = people.groupBy(person => {
   *    return person.age;
   * });
   *
   * grouped.get(25)?.toArray(); // [{ id: 2, name: 'Bob', age: 25 }, { id: 3, name: 'Eve', age: 25 }]
   *
   * grouped.get(30)?.toArray(); // [{ id: 1, name: 'Alice', age: 30 }]
   */
  public groupBy<TKey>(
    fn: (record: TRecord) => TKey
  ): Map<TKey, RecordSet<TRecord>> {
    const map = new Map<TKey, Array<TRecord>>();

    for (const record of this.records) {
      const key = fn(record);

      const group = map.get(key);

      if (group) {
        group.push(record);
      } else {
        map.set(key, [record]);
      }
    }

    const recordSetMap = new Map<TKey, RecordSet<TRecord>>();

    for (const [key, groupRecords] of map) {
      recordSetMap.set(key, new RecordSet(groupRecords));
    }
    return recordSetMap;
  }

  /**
   * @method
   * @description
   * Use this method to reverse the order of the records.
   *
   * @example
   * type Item = { id: number; name: string };
   *
   * const items = RecordSet.of<Item>([
   *   { id: 1, name: 'First' },
   *   { id: 2, name: 'Second' },
   *   { id: 3, name: 'Third' },
   * ]);
   *
   * const reversed = items.reverse();
   *
   * console.log(reversed.toArray());
   * // [
   * //   { id: 3, name: 'Third' },
   * //   { id: 2, name: 'Second' },
   * //   { id: 1, name: 'First' }
   * // ]
   */
  public reverse(): RecordSet<TRecord> {
    return new RecordSet(([] as Array<TRecord>).concat(this.records).reverse());
  }
}

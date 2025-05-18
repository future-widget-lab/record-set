import type { Query as SiftQuery } from 'sift';
import { Query as MingoQuery } from 'mingo';
import { Cursor } from 'mingo/dist/types/cursor';
import { AnyObject } from 'mingo/dist/types/types';
import { Options } from 'mingo/dist/types/core';
import { RecordSetApi } from '../../types/record-set.type';
import { at } from '../at/at.helper';
import { first } from '../first/first.helper';
import { last } from '../last/last.helper';
import { skip } from '../skip/skip.helper';
import { limit } from '../limit/limit.helper';
import { omit } from '../omit/omit.helper';
import { page } from '../page/page.helper';
import { find } from '../find/find.helper';
import { findOne } from '../find-one/find-one.helper';
import { count } from '../count/count.helper';
import { exists } from '../exists/exists.helper';
import { distinct } from '../distinct/distinct.helper';
import { map } from '../map/map.helper';
import { flatMap } from '../flat-map/flat-map.helper';
import { reduce } from '../reduce/reduce.helper';
import { pluck } from '../pluck/pluck.helper';
import { pick } from '../pick/pick.helper';
import { select } from '../select/select.helper';
import { sort } from '../sort/sort.helper';
import { sortBy } from '../sort-by/sort-by.helper';
import { groupBy } from '../group-by/group-by.helper';
import { reverse } from '../reverse/reverse.helper';

export class RecordSet<TRecord> implements RecordSetApi<TRecord> {
  private readonly records: Array<TRecord>;

  static of<TRecord>(records?: Array<TRecord>): RecordSet<TRecord> {
    return new RecordSet(records);
  }

  static empty<TRecord>(): RecordSet<TRecord> {
    return new RecordSet<TRecord>();
  }

  private constructor(records: Array<TRecord> = []) {
    if (!Array.isArray(records)) {
      throw new Error(
        `A record set records must be an array. You are seeing this error because a type of "${typeof records}" was passed to the record set constructor.`
      );
    }

    this.records = records || [];
    this.all = this.all.bind(this);
    this.at = this.at.bind(this);
    this.first = this.first.bind(this);
    this.last = this.last.bind(this);
    this.skip = this.skip.bind(this);
    this.limit = this.limit.bind(this);
    this.page = this.page.bind(this);
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
    this.select = this.select.bind(this);
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
   * record.all(); // [{ id: 1 }, { id: 2 }]
   */
  public all(): Array<TRecord> {
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
    return at({ index, records: this.records });
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
    return first({ records: this.records });
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
    return last({ records: this.records });
  }

  /**
   * @method
   * @description
   * Use this method to skip the first `count` records.
   *
   * @example
   * const records = RecordSet.of([1, 2, 3, 4, 5]);
   *
   * const skipped = records.skip(2);
   *
   * console.log(skipped.all()); // [3, 4, 5]
   */
  public skip(count: number): RecordSet<TRecord> {
    return new RecordSet(skip({ count, records: this.records }));
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
   * console.log(limited.all()); // [1, 2, 3]
   */
  public limit(count: number): RecordSet<TRecord> {
    return new RecordSet(limit({ count, records: this.records }));
  }

  /**
   * @method
   * @description
   * Use this method to return a record set containing the records corresponding to the given page number (1-based) and page size.
   *
   * This method calculates the starting index by `(pageNumber - 1) * pageSize`, then skips that many records, and finally limits the result to `pageSize` number of records.
   *
   * If either `pageNumber` or `pageSize` is less than 1, this method returns an empty RecordSet.
   *
   * @example
   * const records = RecordSet.of([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
   *
   * const firstPage = records.page(1, 3);
   * console.log(firstPage.all()); // [1, 2, 3]
   *
   * const secondPage = records.page(2, 3);
   * console.log(secondPage.all()); // [4, 5, 6]
   */
  public page(pageNumber: number, pageSize: number): RecordSet<TRecord> {
    return new RecordSet(page({ pageNumber, pageSize, records: this.records }));
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
   * console.log(bobs.all()); // [{ id: 2, name: 'Bob', age: 25 }]
   *
   * // Calling find without a query returns the full record set
   * const all = people.find();
   * console.log(all.all()); // same as people.all()
   */
  public find(query?: SiftQuery<TRecord>): RecordSet<TRecord> {
    return RecordSet.of(find({ query, records: this.records }));
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
  public findOne(query?: SiftQuery<TRecord>): TRecord | null {
    return findOne({ query, records: this.records });
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
  public count(query?: SiftQuery<TRecord>): number {
    return count({ query, records: this.records });
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
  public exists(query?: SiftQuery<TRecord>): boolean {
    return exists({ query, records: this.records });
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
  public distinct(
    field: keyof TRecord,
    query?: SiftQuery<TRecord>
  ): Array<any> {
    return distinct({ field, query, records: this.records });
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
   * console.log(userNames.all()); // ['Alice', 'Bob']
   */
  public map<TMappedRecord>(
    fn: (record: TRecord) => TMappedRecord
  ): RecordSet<TMappedRecord> {
    return new RecordSet(map({ transformer: fn, records: this.records }));
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
   * comments.all(); // [{ id: 101, text: 'a' }, { id: 102, text: 'b' }, { id: 103, text: 'c' }]
   */
  public flatMap<TMappedRecord>(
    fn: (record: TRecord) => Array<TMappedRecord>
  ): RecordSet<TMappedRecord> {
    return new RecordSet(flatMap({ transformer: fn, records: this.records }));
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
    return reduce({ reducer: fn, initialValue, records: this.records });
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
    return pluck({ key, records: this.records });
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
   * console.log(userSummaries.all()); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
   */
  public pick<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): RecordSet<Pick<TRecord, TKey>> {
    return RecordSet.of(pick({ fields, records: this.records }));
  }

  /**
   * @method
   * @description
   * Use this method to omit the specified fields from each record, returning a new record set of records without those keys.
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
   * console.log(safeUsers.all());
   * // [{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 25 }]
   */
  public omit<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): RecordSet<Omit<TRecord, TKey>> {
    return RecordSet.of(omit({ fields, records: this.records }));
  }

  /**
   * @method
   * @description
   * Use this method to project each record to include or exclude fields, returning a new record set of records with only those keys:
   * - String: `'a b -c +d'`.
   * - Array of strings: `['a', '-b']`.
   * - Object notation: `{ a: 1, b: 1 }` or `{ c: 0 }`.
   *
   * Inclusive if any field is positively specified (no `-` or `0`).
   *
   * Exclusive if only negatives (`-`) or zeros (`0`).
   *
   * @example
   * const users = RecordSet.of([{ id:1, name:'A', age:30 }]);
   *
   * users.select('id name').all(); // [{ id: 1, name: 'A' }]
   *
   * users.select('-age').all();    // [{ id: 1, name: 'A' }]
   */
  public select(
    spec: string | string[] | Record<string, 0 | 1>
  ): RecordSet<Partial<TRecord>> {
    return new RecordSet(select({ spec, records: this.records }));
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
    return new RecordSet(sort({ compareFn, records: this.records }));
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
   * console.log(sortedByCategoryPrice.all());
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
    return new RecordSet(sortBy({ iteratees, orders, records: this.records }));
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
   * grouped.get(25)?.all(); // [{ id: 2, name: 'Bob', age: 25 }, { id: 3, name: 'Eve', age: 25 }]
   *
   * grouped.get(30)?.all(); // [{ id: 1, name: 'Alice', age: 30 }]
   */
  public groupBy<TKey>(
    fn: (record: TRecord) => TKey
  ): Map<TKey, RecordSet<TRecord>> {
    const map = groupBy({ keyExtractor: fn, records: this.records });

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
   * console.log(reversed.all());
   * // [
   * //   { id: 3, name: 'Third' },
   * //   { id: 2, name: 'Second' },
   * //   { id: 1, name: 'First' }
   * // ]
   */
  public reverse(): RecordSet<TRecord> {
    return new RecordSet(reverse({ records: this.records }));
  }

  /**
   * @method
   * @description
   * Use this helper to create a custom query using the provided condition and options.
   *
   * This method returns a `mingo` [Cursor](https://www.npmjs.com/package/mingo), which allows you to further refine and chain query operations as needed.
   *
   * Note: Queries are lazily evaluated. Meaning that only when `.all()`, `.next()`, or similar methods are invoked the operations are ran.
   */
  public query(
    condition: AnyObject,
    options?: Partial<Options>
  ): Cursor<TRecord> {
    return new MingoQuery(condition, options).find<TRecord>(this.records);
  }
}

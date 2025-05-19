import type { Query as SiftQuery } from 'sift';
import { Cursor } from 'mingo/dist/types/cursor';
import { AnyObject } from 'mingo/dist/types/types';
import { Options } from 'mingo/dist/types/core';

/**
 * @description
 * Use this type to implement the an read-only inmutable collection.
 *
 * This type is heavily inspired in the likes of Mongoose's `Model` API and EmberData's `store` concept.
 *
 * The type intends to represent a data structure which allows consumers to query collections of items using the mongo-like syntax provided by sift along with other common operations.
 *
 * The type is not intended for holding mutable state, every method is meant to create a new instance. That's also the same reason why there are no operations like `create` or `save`.
 */
export type RecordSetApi<TRecord> = {
  /**
   * @method
   * @description
   * Use this method to get a shallow-copied array of all records in the record set.
   */
  all: () => Array<TRecord>;
  /**
   * @method
   * @description
   * Use this method to retrieve the record at the specified index, or null if out of bounds.
   */
  at: (index: number) => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to get the first record in the record set, or null if the record set is empty.
   */
  first: () => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to get the last record in the record set, or null if the record set is empty.
   */
  last: () => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to skip the first `count` records in the record set.
   */
  skip: (count: number) => RecordSetApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to take at most `count` records from the start of the record set.
   */
  limit: (count: number) => RecordSetApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to return a record set containing the records corresponding to the given page number (1-based)
   * and page size.
   */
  page: (pageNumber: number, pageSize: number) => RecordSetApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to get the number of records in the record set.
   */
  length: () => number;
  /**
   * @method
   * @description
   * Use this method to determine whether the record set contains any records.
   */
  isEmpty: () => boolean;
  /**
   * @method
   * @description
   * Use this method to find all the matching records given a query.
   *
   * Fallsback to the the same set of items if no `query` is provided.
   */
  find: (query: SiftQuery<TRecord>) => RecordSetApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to find the first matching record given a query.
   *
   * Defaults to the first element if no `query` is provided.
   *
   * Fallbacks to `null` if the query provided does not return any matches.
   */
  findOne: (query?: SiftQuery<TRecord>) => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to count the number of records matching the query.
   */
  count: (query?: SiftQuery<TRecord>) => number;
  /**
   * @method
   * @description
   * Use this method to check if any record exists matching a given query.
   */
  exists: (query?: SiftQuery<TRecord>) => boolean;
  /**
   * @method
   * @description
   * Use this method to check if every record matches the given query.
   */
  every: (query?: SiftQuery<TRecord>) => boolean;
  /**
   * @method
   * @description
   * Use this method to check if none of the record matches the given query.
   */
  none: (query?: SiftQuery<TRecord>) => boolean;
  /**
   * @method
   * @description
   * Use this method to get distinct values of a field among records matching the query.
   */
  distinct: (field: keyof TRecord, query?: SiftQuery<TRecord>) => Array<any>;
  /**
   * @method
   * @description
   * Use this method to transform all records in the record set and return a new record set of the transformed records.
   */
  map: <TransformedRecord>(
    fn: (item: TRecord) => TransformedRecord
  ) => RecordSetApi<TransformedRecord>;
  /**
   * @method
   * @description
   * Use this method to map each record to zero or more records, then flatten the results into a single new record set.
   *
   * This is handy for extracting nested arrays or expanding items.
   */
  flatMap: <TMappedRecord>(
    fn: (record: TRecord) => Array<TMappedRecord>
  ) => RecordSetApi<TMappedRecord>;
  /**
   * @method
   * @description
   * Use this method to reduce the record set to a single accumulated value.
   */
  reduce<TAccumulator>(
    fn: (accumulator: TAccumulator, record: TRecord) => TAccumulator,
    initialValue: TAccumulator
  ): TAccumulator;
  /**
   * @method
   * @description
   * Use this method to extract an array of a single field's values from all records in the record set.
   */
  pluck: <TKey extends keyof TRecord>(key: TKey) => Array<TRecord[TKey]>;
  /**
   * @method
   * @description
   * Use this method to pick only the specified fields from each record, returning a new record set of records with only those keys.
   */
  pick: <TKey extends keyof TRecord>(
    fields: Array<TKey>
  ) => RecordSetApi<Pick<TRecord, TKey>>;
  /**
   * @method
   * @description
   * Use this method to omit the specified fields from each record, returning a new record set of records without those keys.
   */
  omit: <TKey extends keyof TRecord>(
    fields: Array<TKey>
  ) => RecordSetApi<Omit<TRecord, TKey>>;
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
   */
  select: (
    spec: string | Array<string> | Record<string, 0 | 1>
  ) => RecordSetApi<Partial<TRecord>>;
  /**
   * @method
   * @description
   * Use this method to sort the records with the provided compare function.
   */
  sort: (
    compareFn: (a: TRecord, b: TRecord) => number
  ) => RecordSetApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to sort the records by key(s) using lodash orderBy.
   */
  reverse: () => RecordSetApi<TRecord>;
  /**
   * @method
   * @description
   * Use this helper to create a custom query using the provided condition and options.
   *
   * This method returns a `mingo` [Cursor](https://www.npmjs.com/package/mingo), which allows you to further refine and chain query operations as needed.
   *
   * Note: Queries are lazily evaluated. Meaning that only when `.all()`, `.next()`, or similar methods are invoked the operations are ran.
   */
  query(condition: AnyObject, options?: Partial<Options>): Cursor<TRecord>;
};

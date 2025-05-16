import type { Query } from 'sift';

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
export type CollectionApi<TRecord> = {
  /**
   * @method
   * @description
   * Use this method to get a shallow-copied array of all records in the collection.
   */
  toArray: () => Array<TRecord>;
  /**
   * @method
   * @description
   * Use this method to retrieve the record at the specified index, or null if out of bounds.
   */
  at: (index: number) => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to get the first record in the collection, or null if the collection is empty.
   */
  first: () => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to get the last record in the collection, or null if the collection is empty.
   */
  last: () => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to get the number of records in the collection.
   */
  length: () => number;
  /**
   * @method
   * @description
   * Use this method to determine whether the collection contains any records.
   */
  isEmpty: () => boolean;
  /**
   * @method
   * @description
   * Use this method to find all the matching records given a query.
   *
   * Fallsback to the the same set of items if no `query` is provided.
   */
  find: (query: Query<TRecord>) => CollectionApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to find the first matching record given a query.
   *
   * Defaults to the first element if no `query` is provided.
   *
   * Fallbacks to `null` if the query provided does not return any matches.
   */
  findOne: (query?: Query<TRecord>) => TRecord | null;
  /**
   * @method
   * @description
   * Use this method to count the number of records matching the query.
   */
  count: (query?: Query<TRecord>) => number;
  /**
   * @method
   * @description
   * Use this method to check if any record exists matching the query.
   */
  exists: (query?: Query<TRecord>) => boolean;
  /**
   * @method
   * @description
   * Use this method to get distinct values of a field among records matching the query.
   */
  distinct: (field: keyof TRecord, query?: Query<TRecord>) => Array<any>;
  /**
   * @method
   * @description
   * Use this method to transform all records in the collection and return a new Collection of the transformed records.
   */
  map: <TransformedRecord>(
    fn: (item: TRecord) => TransformedRecord
  ) => CollectionApi<TransformedRecord>;
  /**
   * @method
   * @description
   * Use this method to map each record to zero or more records, then flatten the results into a single new Collection.
   *
   * This is handy for extracting nested arrays or expanding items.
   */
  flatMap: <TMappedRecord>(
    fn: (record: TRecord) => Array<TMappedRecord>
  ) => CollectionApi<TMappedRecord>;
  /**
   * @method
   * @description
   * Use this method to reduce the collection to a single accumulated value.
   */
  reduce<TAccumulator>(
    fn: (accumulator: TAccumulator, record: TRecord) => TAccumulator,
    initialValue: TAccumulator
  ): TAccumulator;
  /**
   * @method
   * @description
   * Use this method to extract an array of a single field's values from all records in the collection.
   */
  pluck: <TKey extends keyof TRecord>(key: TKey) => Array<TRecord[TKey]>;
  /**
   * @method
   * @description
   * Use this method to pick only the specified fields from each record, returning a new Collection of records with only those keys.
   */
  pick: <TKey extends keyof TRecord>(
    fields: Array<TKey>
  ) => CollectionApi<Pick<TRecord, TKey>>;
  /**
   * @method
   * @description
   * Use this method to omit the specified fields from each record, returning a new Collection of records without those keys.
   */
  omit: <TKey extends keyof TRecord>(
    fields: Array<TKey>
  ) => CollectionApi<Omit<TRecord, TKey>>;
  /**
   * @method
   * @description
   * Use this method to sort the records with the provided compare function.
   */
  sort: (
    compareFn: (a: TRecord, b: TRecord) => number
  ) => CollectionApi<TRecord>;
  /**
   * @method
   * @description
   * Use this method to sort the records by key(s) using lodash orderBy.
   */
  reverse: () => CollectionApi<TRecord>;
};

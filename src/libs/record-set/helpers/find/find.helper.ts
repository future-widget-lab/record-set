import sift from 'sift';
import type { Query } from 'sift';

type FindOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to find all the matching records given a query.
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
export const find = <TRecord>(
  options: FindOptions<TRecord>
): Array<TRecord> => {
  const { query, records } = options;

  if (!query) {
    return records;
  }

  return records.filter(sift(query));
};

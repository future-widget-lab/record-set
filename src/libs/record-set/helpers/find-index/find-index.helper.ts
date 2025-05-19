import sift from 'sift';
import type { Query } from 'sift';

type FindOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to return the index of the first element in the array where predicate is true, and -1 otherwise.
 */
export const findIndex = <TRecord>(options: FindOptions<TRecord>): number => {
  const { query, records } = options;

  return records.findIndex(sift(query));
};

import sift from 'sift';
import type { Query } from 'sift';

type EveryOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this method to check if none of the record matches the given query.
 */
export const none = <TRecord>(options: EveryOptions<TRecord>): boolean => {
  const { query, records } = options;

  return !records.some(sift(query));
};

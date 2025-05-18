import sift from 'sift';
import type { Query } from 'sift';

type EveryOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this method to check if every record matches the given query.
 */
export const every = <TRecord>(options: EveryOptions<TRecord>): boolean => {
  const { query, records } = options;

  if (!query) {
    return records.length > 0;
  }

  return records.every(sift(query));
};

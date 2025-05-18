import sift from 'sift';
import type { Query } from 'sift';

type CountOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to count the number of records matching the query.
 */
export const count = <TRecord>(options: CountOptions<TRecord>): number => {
  const { query, records } = options;

  if (!query) {
    return records.length;
  }

  return records.filter(sift(query)).length;
};

import sift from 'sift';
import type { Query } from 'sift';

type ExistsOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this method to check if any record exists matching the given query.
 */
export const exists = <TRecord>(options: ExistsOptions<TRecord>): boolean => {
  const { query, records } = options;

  if (!query) {
    return records.length > 0;
  }

  return records.some(sift(query));
};

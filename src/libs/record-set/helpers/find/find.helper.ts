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

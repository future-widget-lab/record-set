import sift from 'sift';
import type { Query } from 'sift';
import { first } from '../first/first.helper';

type FindOneOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to find the first matching record given a query.
 *
 * Defaults to the first element if no `query` is provided.
 *
 * Fallbacks to `null` if the query provided does not return any matches.
 */
export const findOne = <TRecord>(
  options: FindOneOptions<TRecord>
): TRecord | null => {
  const { query, records } = options;

  if (!query) {
    return first({ records });
  }

  return records.find(sift(query)) ?? null;
};

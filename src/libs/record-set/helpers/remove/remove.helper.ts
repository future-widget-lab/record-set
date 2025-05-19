import sift from 'sift';
import type { Query } from 'sift';

type RemoveOptions<TRecord> = {
  query: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to remove all records from the record set that match the given query.
 */
export const remove = <TRecord>(options: RemoveOptions<TRecord>) => {
  const { query, records } = options;

  const match = sift(query);

  const filtered: Array<TRecord> = [];

  for (const record of records) {
    if (!match(record)) {
      filtered.push(record);
    }
  }

  return filtered;
};

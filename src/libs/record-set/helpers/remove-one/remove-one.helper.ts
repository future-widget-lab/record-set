import sift from 'sift';
import type { Query } from 'sift';

type RemoveOneOptions<TRecord> = {
  query: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to remove the first record from the record set that matches the given query.
 */
export const removeOne = <TRecord>(
  options: RemoveOneOptions<TRecord>
): Array<TRecord> => {
  const { query, records } = options;

  const match = sift(query);
  const filtered: Array<TRecord> = [];
  let removed = false;

  for (const record of records) {
    if (!removed && match(record)) {
      removed = true;

      continue;
    }

    filtered.push(record);
  }

  return filtered;
};

import sift from 'sift';
import type { Query } from 'sift';

type UpdateOptions<TRecord> = {
  changes: Partial<TRecord>;
  query: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to update records in the record set matching the sift query by merging the provided update object.
 *
 * Performs a shallow merge of the update object into matching records.
 */
export const update = <TRecord>(
  options: UpdateOptions<TRecord>
): Array<TRecord> => {
  const { query, records, changes } = options;

  const match = sift(query);

  const updated: Array<TRecord> = [];

  for (const record of records) {
    if (match(record)) {
      updated.push({
        ...record,
        ...changes,
      });
    } else {
      updated.push(record);
    }
  }

  return updated;
};

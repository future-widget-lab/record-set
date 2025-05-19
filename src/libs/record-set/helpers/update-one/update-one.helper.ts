import sift from 'sift';
import type { Query } from 'sift';

type UpdateOptions<TRecord> = {
  records: Array<TRecord>;
  changes: Partial<TRecord>;
  query: Query<TRecord>;
};

/**
 * @description
 * Update this helper to update record in the record set matching the sift query by merging the provided update object.
 *
 * Performs a shallow merge of the update object into the first matching record.
 */
export const updateOne = <TRecord>(
  options: UpdateOptions<TRecord>
): Array<TRecord> => {
  const { query, records, changes } = options;

  const match = sift(query);

  const updated = [...records];

  let index = 0;

  for (const record of updated) {
    if (match(record)) {
      updated[index] = {
        ...record,
        ...changes,
      };

      break;
    }

    index++;
  }

  return updated;
};

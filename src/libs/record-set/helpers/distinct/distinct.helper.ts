import sift from 'sift';
import type { Query } from 'sift';

type DistinctOptions<TRecord> = {
  field: keyof TRecord;
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to get distinct values of a field among records matching the query.
 */
export const distinct = <TRecord>(
  options: DistinctOptions<TRecord>
): Array<TRecord[keyof TRecord]> => {
  const { field, query, records } = options;

  const filteredItems = query ? records.filter(sift(query)) : records;

  const seen = new Set<TRecord[keyof TRecord]>();
  const result: Array<TRecord[keyof TRecord]> = [];

  for (const record of filteredItems) {
    const value = record[field];

    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
};

import uniqBy from 'lodash.uniqby';
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
export const distinct = <TRecord>(options: DistinctOptions<TRecord>) => {
  const { field, query, records } = options;

  const filteredItems = query ? records.filter(sift(query)) : records;

  const uniqueItems = uniqBy(filteredItems, field as string);

  return uniqueItems.map((record) => {
    return record[field];
  });
};

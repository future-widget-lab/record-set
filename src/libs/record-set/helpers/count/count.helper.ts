import sift from 'sift';
import type { Query } from 'sift';

type CountOptions<TRecord> = {
  query?: Query<TRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to count the number of records matching the query.
 *
 * @example
 * type Item = { category: string; value: number };
 *
 * const items = RecordSet.of<Item>([
 *   { category: 'fruit', value: 10 },
 *   { category: 'fruit', value: 20 },
 *   { category: 'vegetable', value: 15 },
 * ]);
 *
 * const fruitCount = items.count({ category: 'fruit' });
 * console.log(fruitCount); // 2
 *
 * const totalCount = items.count();
 * console.log(totalCount); // 3
 */
export const count = <TRecord>(options: CountOptions<TRecord>): number => {
  const { query, records } = options;

  if (!query) {
    return records.length;
  }

  return records.filter(sift(query)).length;
};

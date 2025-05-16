type GroupByOptions<TRecord, TKey> = {
  keyExtractor: (record: TRecord) => TKey;
  records: Array<TRecord>;
};

/**
 * @description
 * Use helper to group records by a key derived from each record.
 *
 * It returns a `Map` where keys are group keys and values are record sets of grouped records.
 */
export const groupBy = <TRecord, TKey>(
  options: GroupByOptions<TRecord, TKey>
): Map<TKey, Array<TRecord>> => {
  const { keyExtractor, records } = options;

  const map = new Map<TKey, Array<TRecord>>();

  for (const record of records) {
    const key = keyExtractor(record);

    const group = map.get(key);

    if (group) {
      group.push(record);
    } else {
      map.set(key, [record]);
    }
  }

  return map;
};

type PluckOptions<TRecord, TKey extends keyof TRecord> = {
  key: TKey;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to extract an array of a single field's values from all records in the record set.
 */
export const pluck = <TRecord, TKey extends keyof TRecord>(
  options: PluckOptions<TRecord, TKey>
): Array<TRecord[TKey]> => {
  const { key, records } = options;

  const plucked: Array<TRecord[TKey]> = [];

  for (const record of records) {
    plucked.push(record[key]);
  }

  return plucked;
};

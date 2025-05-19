type PluckOptions<TRecord, TKey extends keyof TRecord> = {
  field: TKey;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to extract an array of a single field's values from all records in the record set.
 */
export const pluck = <TRecord, TKey extends keyof TRecord>(
  options: PluckOptions<TRecord, TKey>
): Array<TRecord[TKey]> => {
  const { field, records } = options;

  const plucked: Array<TRecord[TKey]> = [];

  for (const record of records) {
    plucked.push(record[field]);
  }

  return plucked;
};

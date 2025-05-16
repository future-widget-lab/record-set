type FirstOptions<TRecord> = {
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to get the last record in the record set, or null if the record set is empty.
 */
export const last = <TRecord>(
  options: FirstOptions<TRecord>
): TRecord | null => {
  const { records } = options;

  return records[records.length - 1] ?? null;
};

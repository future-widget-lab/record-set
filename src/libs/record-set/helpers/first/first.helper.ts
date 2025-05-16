type FirstOptions<TRecord> = {
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to get the first record in the record set, or null if the record set is empty.
 */
export const first = <TRecord>(
  options: FirstOptions<TRecord>
): TRecord | null => {
  const { records } = options;

  return records[0] ?? null;
};

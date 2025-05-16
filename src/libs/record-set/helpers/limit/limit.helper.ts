type LimitOptions<TRecord> = {
  count: number;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to take at most `count` records from the start of the record set.
 */
export const limit = <TRecord>(
  options: LimitOptions<TRecord>
): Array<TRecord> => {
  const { count, records } = options;

  if (count < 0) {
    return [];
  }

  if (count === 0) {
    return [];
  }

  return records.slice(0, count);
};

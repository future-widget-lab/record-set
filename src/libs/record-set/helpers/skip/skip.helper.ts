type SkipOptions<TRecord> = {
  count: number;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to skip the first `count` records.
 */
export const skip = <TRecord>(
  options: SkipOptions<TRecord>
): Array<TRecord> => {
  const { count, records } = options;

  if (count <= 0) {
    return records;
  }

  return records.slice(count);
};

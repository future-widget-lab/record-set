type AtOptions<TRecord> = {
  index: number;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to retrieve the record at the specified index, or null if out of bounds.
 */
export const at = <TRecord>(options: AtOptions<TRecord>): TRecord | null => {
  const { index, records } = options;

  return records.at(index) ?? null;
};

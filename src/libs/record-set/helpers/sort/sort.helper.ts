type SortOptions<TRecord> = {
  compareFn: (a: TRecord, b: TRecord) => number;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to sort the records with the provided compare function.
 */
export const sort = <TRecord>(options: SortOptions<TRecord>) => {
  const { compareFn, records } = options;

  return ([] as Array<TRecord>).concat(records).sort(compareFn);
};

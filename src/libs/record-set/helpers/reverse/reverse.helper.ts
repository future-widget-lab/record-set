type ReverseOptions<TRecord> = {
  records: Array<TRecord>;
};

/**
 * @description
 * Use this method to reverse the order of the records.
 */
export const reverse = <TRecord>(options: ReverseOptions<TRecord>) => {
  const { records } = options;

  return ([] as Array<TRecord>).concat(records).reverse();
};

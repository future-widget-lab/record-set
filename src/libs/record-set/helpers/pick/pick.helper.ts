type PickOptions<TRecord, TKey extends keyof TRecord> = {
  fields: Array<TKey>;
  records: Array<TRecord>;
};

/**
 * @method
 * @description
 * Use this method to pick only the specified fields from each record, returning a new array of records with only those keys.
 */
export const pick = <TRecord, TKey extends keyof TRecord>(
  options: PickOptions<TRecord, TKey>
): Array<Pick<TRecord, TKey>> => {
  const { fields, records } = options;

  const picked: Array<Pick<TRecord, TKey>> = [];

  for (const record of records) {
    const pickObj = {} as Pick<TRecord, TKey>;

    for (const field of fields) {
      // @ts-expect-error
      if (field in record) {
        pickObj[field] = record[field];
      }
    }

    picked.push(pickObj);
  }

  return picked;
};

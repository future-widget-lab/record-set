type OmitOptions<TRecord, TKey extends keyof TRecord> = {
  fields: Array<TKey>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to omit the specified fields from each record, returning a new array of records without those keys.
 */
export const omit = <TRecord, TKey extends keyof TRecord>(
  options: OmitOptions<TRecord, TKey>
): Array<Omit<TRecord, TKey>> => {
  const { fields, records } = options;

  const omitted: Array<Omit<TRecord, TKey>> = [];

  for (const record of records) {
    const omitObj = { ...record } as Omit<TRecord, TKey>;

    for (const field of fields) {
      if (field in omitObj) {
        // @ts-expect-error
        delete omitObj[field];
      }
    }

    omitted.push(omitObj);
  }

  return omitted;
};

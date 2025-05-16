type MapOptions<TRecord, TMappedRecord> = {
  transformer: (record: TRecord) => TMappedRecord;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to transform all records in the record set and return a new RecordSet of the transformed records.
 */
export const map = <TRecord, TMappedRecord>(
  options: MapOptions<TRecord, TMappedRecord>
): Array<TMappedRecord> => {
  const { transformer, records } = options;

  const transformed: Array<TMappedRecord> = [];

  for (const record of records) {
    transformed.push(transformer(record));
  }

  return transformed;
};

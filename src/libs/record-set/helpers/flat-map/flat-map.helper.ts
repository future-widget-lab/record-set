type FlatMapOptions<TRecord, TMappedRecord> = {
  transformer: (record: TRecord) => Array<TMappedRecord>;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this method to map each record to zero or more records, then flatten the results into a single new RecordSet.
 *
 * This is handy for extracting nested arrays or expanding items.
 */
export const flatMap = <TRecord, TMappedRecord>(
  options: FlatMapOptions<TRecord, TMappedRecord>
): Array<TMappedRecord> => {
  const { transformer, records } = options;

  const flatted: Array<TMappedRecord> = [];

  for (const record of records) {
    const mapped = transformer(record);

    for (const subItem of mapped) {
      flatted.push(subItem);
    }
  }

  return flatted;
};

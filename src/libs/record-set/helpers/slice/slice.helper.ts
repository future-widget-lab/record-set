type SliceOptions<TRecord> = {
  start: number;
  end?: number;
  records: Array<TRecord>;
};

/**
 * @method
 * @description
 * Use this method to create a shallow copy slice of the records in the record set, extracting records from the specified `start` index up to, but not including, the `end` index.
 *
 * It operates on the current set of records without applying any filtering.
 *
 * For filtering, use `.find()` prior to `.slice()`.
 */
export const slice = <TRecord>(
  options: SliceOptions<TRecord>
): Array<TRecord> => {
  return options.records.slice(options.start, options.end);
};

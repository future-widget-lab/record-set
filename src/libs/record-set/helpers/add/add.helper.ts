type AddOptions<TRecord> = {
  newRecords: TRecord | Array<TRecord>;
  index?: number;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to add one or more records to the record set at the specified index.
 *
 * The insertion index is zero-based. If omitted or out of bounds, new records are appended at the end.
 */
export const add = <TRecord>(options: AddOptions<TRecord>): Array<TRecord> => {
  const { newRecords: inputNewRecords, index, records } = options;

  const newrecords = Array.isArray(inputNewRecords)
    ? inputNewRecords
    : [inputNewRecords];

  const insertIndex =
    typeof index === 'number' && index >= 0 && index <= records.length
      ? index
      : records.length;

  const updated = [
    ...records.slice(0, insertIndex),
    ...newrecords,
    ...records.slice(insertIndex),
  ];

  return updated;
};

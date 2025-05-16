type ReduceOptions<TRecord, TAccumulator> = {
  reducer: (accumulator: TAccumulator, record: TRecord) => TAccumulator;
  initialValue: TAccumulator;
  records: Array<TRecord>;
};

/**
 * @description
 * Use this helper to reduce the record set to a single accumulated value.
 */
export const reduce = <TRecord, TAccumulator>(
  options: ReduceOptions<TRecord, TAccumulator>
): TAccumulator => {
  const { reducer, initialValue, records } = options;

  let accumulator = initialValue;

  for (const record of records) {
    accumulator = reducer(accumulator, record);
  }

  return accumulator;
};

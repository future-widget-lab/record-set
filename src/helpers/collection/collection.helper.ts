import sift, { type Query } from 'sift';
import { CollectionApi } from '../../types/collection.type';

export class Collection<TRecord> implements CollectionApi<TRecord> {
  private readonly items: Array<TRecord>;

  static from<TRecord>(items?: Array<TRecord>): Collection<TRecord> {
    return new Collection(items);
  }

  private constructor(items: Array<TRecord> = []) {
    if (!Array.isArray(items)) {
      throw new Error(
        `Collection records must be an array (got: ${typeof items}).`
      );
    }

    this.items = items || [];
    this.toArray = this.toArray.bind(this);
    this.at = this.at.bind(this);
    this.head = this.head.bind(this);
    this.tail = this.tail.bind(this);
    this.length = this.length.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.find = this.find.bind(this);
    this.findOne = this.findOne.bind(this);
    this.count = this.count.bind(this);
    this.exists = this.exists.bind(this);
    this.distinct = this.distinct.bind(this);
    this.map = this.map.bind(this);
    this.pluck = this.pluck.bind(this);
    this.pick = this.pick.bind(this);
    this.omit = this.omit.bind(this);
    this.sort = this.sort.bind(this);
    this.reverse = this.reverse.bind(this);
  }

  public [Symbol.iterator](): Iterator<TRecord> {
    return this.items[Symbol.iterator]();
  }

  /**
   * @method
   * @description
   * Use this method to get a shallow-copied array of all records in the store.
   */
  public toArray(): Array<TRecord> {
    return [...this.items];
  }

  /**
   * @method
   * @description
   * Use this method to retrieve the record at the specified index, or null if out of bounds.
   */
  public at(index: number): TRecord | null {
    return this.items.at(index) ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the first record in the store, or null if the store is empty.
   */
  public head(): TRecord | null {
    return this.items[0] ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the last record in the store, or null if the store is empty.
   */
  public tail(): TRecord | null {
    return this.items[this.items.length - 1] ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to get the number of records in the store.
   */
  public length(): number {
    return this.items.length;
  }

  /**
   * @method
   * @description
   * Use this method to determine whether the store contains any records.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * @method
   * @description
   * Use this method to find all the matching records given a query.
   *
   * Fallsback to the the same set of items if no `query` is provided.
   */
  public find(query?: Query<TRecord>): Collection<TRecord> {
    if (!query) {
      return this;
    }

    return Collection.from(this.items.filter(sift(query)));
  }

  /**
   * @method
   * @description
   * Use this method to find the first matching record given a query.
   *
   * Defaults to the first element if no `query` is provided.
   *
   * Fallbacks to `null` if the query provided does not return any matches.
   */
  public findOne(query?: Query<TRecord>): TRecord | null {
    if (!query) {
      return this.head();
    }

    return this.items.find(sift(query)) ?? null;
  }

  /**
   * @method
   * @description
   * Use this method to count the number of records matching the query.
   */
  public count(query?: Query<TRecord>): number {
    if (!query) {
      return this.length();
    }

    return this.items.filter(sift(query)).length;
  }

  /**
   * @method
   * @description
   * Use this method to check if any record exists matching the query.
   */
  public exists(query?: Query<TRecord>): boolean {
    if (!query) {
      return !this.isEmpty();
    }

    return this.items.some(sift(query));
  }

  /**
   * @method
   * @description
   * Use this method to get distinct values of a field among records matching the query.
   */
  public distinct(field: keyof TRecord, query?: Query<TRecord>): Array<any> {
    const filteredItems = query ? this.items.filter(sift(query)) : this.items;

    const values = filteredItems.map((item) => {
      return item[field];
    });

    const distinctValues = Array.from(new Set(values));

    return distinctValues;
  }

  /**
   * @method
   * @description
   * Use this method to transform all records in the store and return a new Collection of the transformed records.
   */
  public map<TMappedRecord>(
    fn: (item: TRecord) => TMappedRecord
  ): Collection<TMappedRecord> {
    return new Collection(this.items.map(fn));
  }

  /**
   * @method
   * @description
   * Use this method to extract an array of a single field's values from all records in the store.
   */
  public pluck<K extends keyof TRecord>(key: K): Array<TRecord[K]> {
    return this.items.map((item) => {
      return item[key];
    });
  }

  /**
   * @method
   * @description
   * Use this method to pick only the specified fields from each record, returning a new Collection of records with only those keys.
   */
  public pick<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): Collection<Pick<TRecord, TKey>> {
    const picked = this.items.map((item) => {
      return fields.reduce((obj, key) => {
        obj[key] = item[key];

        return obj;
      }, {} as Pick<TRecord, TKey>);
    });

    return Collection.from(picked);
  }

  /**
   * @method
   * @description
   * Use this method to omit the specified fields from each record, returning a new Collection of records without those keys.
   */
  public omit<TKey extends keyof TRecord>(
    fields: Array<TKey>
  ): Collection<Omit<TRecord, TKey>> {
    const omitted = this.items.map((item) => {
      const clone = { ...item } as any;

      fields.forEach((field) => {
        delete clone[field];
      });

      return clone;
    });

    return Collection.from(omitted);
  }

  /**
   * @method
   * @description
   * Use this method to sort the records with the provided compare function.
   */
  public sort(
    compareFn: (a: TRecord, b: TRecord) => number
  ): Collection<TRecord> {
    return new Collection(
      ([] as Array<TRecord>).concat(this.items).sort(compareFn)
    );
  }

  /**
   * @method
   * @description
   * Use this method reverse the order of the records.
   */
  public reverse(): Collection<TRecord> {
    return new Collection(([] as Array<TRecord>).concat(this.items).reverse());
  }
}

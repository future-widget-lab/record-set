# @future-widget-lab/record-set

A fluent, immutable data structure for filtering, sorting, and transforming in-memory record collections using MongoDB-like syntax.

## Features

- Immutable, read-only operations that always return new collections or primitives.
- MongoDB-style querying powered by `sift` for expressive filters like `$gt`, `$lt`, `$in`, and more.
- Rich API for retrieval, inspection, filtering, transformation, sorting, and mutation of records.
- Supports intuitive iteration with native `for...of` loops and `forEach`.
- Includes immutable mutation helpers: `add`, `prepend`, `append`, `update`, `updateOne`, `remove`, `removeOne`, `concat`.
- Custom query builder via `mingo` cursor for advanced chainable operations.

## Philosophy

The idea of a dedicated data structure for handling records was born from my envy of the ergonomics available in back-end systems. There, developers enjoy standardized, expressive query interfaces via ORMs or ODMs (e.g., `prisma`, `mongoose`). While arrays of objects remain the bread and butter of front-end development, I believe having a dedicated, standardized interface for working with remote data records (e.g., from `@tanstack-query/react`, `swr`) brings clear value. Without it, front-end developers fall back on raw array methods and repeated ad-hoc logic for common tasks.

This package provides a data structure to serve as a foundation for managing collections of records in front-end applications:

- **Minimal abstraction**: It does not replace arrays or attempt to serve as a general-purpose data structure, but offers a solid foundation before reaching for manual array operations as data complexity grows.
- **Ergonomics with immutability**: Immutability is a helpful side effect rather than a goal. The focus is on making common front-end tasks easier—such as transforming records to IDs or querying with multiple criteria—while preventing accidental mutations and side effects.
- **Data-agnostic**: Though designed with front-end cases in mind, `RecordSet` works seamlessly with any array of objects regardless of environment or domain.
- **Declarative and familiar**: Inspired in `mongoose` and leveraging MongoDB-style queries via `sift`, developers can express complex filters clearly and intuitively.
- **Consistent API surface**: One unified interface covers common needs like finding, filtering, counting, mapping, picking fields, and sorting.

This `RecordSet` differs from typical back-end record collections in an important way: it intentionally has no opinions in how mutation methods such as adding, updating, or replacing records should sync the state with the back-end. Its sole purpose is to provide a clean, declarative way to query and transform collections. Mutation logic tends to be the most complex part of a system and is heavily tied to the specifics of the framework or state management approach in use (e.g., `react`, `vue`, etc.). By avoiding mutation responsibilities, this package stays focused, predictable, and easy to integrate with any architecture.

## Installation

Install with npm:

```bash
npm install @future-widget-lab/record-set
```

> **Note**: `sift` and `mingo` are user underneath and _should_ be installed alongside if you wish to leverage their types.

## Usage

### Basics

#### `RecordSet.of`

Use this static method to create an a record set from the given array..

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);
```

#### `RecordSet.prototype.all`

Use this method to get a shallow-copied array of all records in the record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

console.log(records.all()); // [{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 25 }]
```

### Inspection

#### `RecordSet.prototype.empty`

Use this static method to create an empty record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const empty = RecordSet.empty<TPerson>();
```

#### `RecordSet.prototype.isEmpty`

Use this method to determine whether the record set contains any records.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

console.log(records.isEmpty()); // false

const emptyRecords = RecordSet.empty<Person>();

console.log(emptyRecords.isEmpty()); // true
```

#### `RecordSet.prototype.length`

Use this method to get the number of records in the record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

console.log(records.length()); // 2

const emptyRecords = RecordSet.empty<Person>();

console.log(emptyRecords.length()); // 0
```

#### `RecordSet.prototype.count`

Use this method to count the number of records matching the query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const peopleAboveTwenty = records.count({ age: { $gte: 20 } });

console.log(peopleAboveTwenty); // 1
```

#### `RecordSet.prototype.exists`

Use this method to check if any record exists matching the query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const existsUnderTwenty = records.exists({ age: { $lt: 20 } });

console.log(existsUnderTwenty); // false
```

#### `RecordSet.prototype.every`

Use this method to check if every record matches the given query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const everyoneIsAboveFifteen = records.exists({ age: { $gte: 15 } });

console.log(everyoneIsAboveFifteen); // true
```

#### `RecordSet.prototype.none`

Use this method to check if every record matches the given query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const noneIsAboveFourty = records.none({ age: { $gte: 40 } });

console.log(noneIsAboveFourty); // true
```

### Retrieval

#### `RecordSet.prototype.at`

Use this method to retrieve the record at the specified index, or null if out of bounds.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const first = records.at(0);

console.log(first); // { id: 1, name: 'Alice', age: 30 }

const first = records.at(1);

console.log(first); // { id: 2, name: 'Bob', age: 25 }
```

#### `RecordSet.prototype.first`

Use this method to get the first record in the record set, or null if the record set is empty.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const first = records.first();

console.log(first); // { id: 1, name: 'Alice', age: 30 }
```

#### `RecordSet.prototype.last`

Use this method to get the last record in the record set, or null if the record set is empty.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const last = records.last();

console.log(last); // { id: 2, name: 'Bob', age: 25 }
```

### Iteration

#### Loops

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

for (const person of records) {
  console.log(person.id, person.name);
}
```

#### `RecordSet.prototype.forEach`

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

records.forEach((record) => {
  console.log(person.id, person.name);
});
```

### Filtering

#### `RecordSet.prototype.find`

Use this method to find all the matching records given a query.

Falls back to the same set of records if no `query` is provided.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const people = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
]);

const peopleNamedBob = people.find({ name: 'Bob' });
console.log(peopleNamedBob.all()); // [{ id: 2, name: 'Bob', age: 25 }]

const allPeople = people.find();
console.log(allPeople.all()); // same as people.all()
```

#### `RecordSet.prototype.findOne`

Use this method to find the first matching record given a query.

Defaults to the first element if no `query` is provided.

Fallbacks to `null` if the query provided does not return any matches.

```typescript
type Person = { id: number; name: string; age: number };

const people = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const bob = people.findOne({ name: 'Bob' });
console.log(bob); // { id: 2, name: 'Bob', age: 25 }

const nonExistent = people.findOne({ name: 'Eve' });
console.log(nonExistent); // null

const firstPerson = people.findOne();
console.log(firstPerson); // { id: 1, name: 'Alice', age: 30 }
```

#### `RecordSet.prototype.findIndex`

Use this helper to return the index of the first element in the array where predicate is true, and -1 otherwise.

```typescript
type Person = { id: number; name: string; age: number };

const people = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
]);

const bobsIndex = people.findIndex({ name: 'Bob' });
console.log(bobsIndex); // 1
```

### Advanced Filtering

Sometimes, your filtering and querying needs go beyond simple MongoDB-like queries supported by the core `RecordSet` API. You may require complex operations such as multi-stage aggregations, projections, or sorting combined with filters in sophisticated ways.

In these cases, using the `.query()` method is recommended. It leverages [`mingo`](https://www.npmjs.com/package/mingo), a full-featured MongoDB query engine that extends your querying capabilities.

The `.query()` method returns a [`mingo` Cursor](https://www.npmjs.com/package/mingo), enabling you to build complex, composable query pipelines with operations like. The queries are lazily evaluated — processing occurs only upon invocation of terminal methods such as `.all()` or `.next()`.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';
import type { Options } from 'mingo';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
  { id: 4, name: 'Charlie', age: 28 },
  { id: 5, name: 'Dave', age: 40 },
]);

// Build a mingo cursor to find persons age 25 or older
const cursor = records.query({ age: { $gte: 25 } }).sort({ age: -1 }); // explicitly sort descending by age

// Take top 3 records according to the sorting
const top3 = cursor.limit(3).all();

console.log(top3); // [{ id: 5, name: 'Dave', age: 40 }, { id: 3, name: 'Eve', age: 35 }, { id: 1, name: 'Alice', age: 30 }]
```

### Subsetting

#### `RecordSet.prototype.skip`

Use this method to skip the first `count` records.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const records = RecordSet.of<Item>([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
]);

const skipped = records.skip(2);

console.log(skipped.all()); // [{ id: 3 }, { id: 4 }, { id: 5 }]
```

#### `RecordSet.prototype.limit`

Use this method to take at most `count` records from the start of the record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const records = RecordSet.of<Item>([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
]);

const limited = records.limit(3);

console.log(limited.all()); // [{ id: 1 }, { id: 2 }, { id: 3 }]
```

#### `RecordSet.prototype.page`

Use this method to return a record set containing the records corresponding to the given page number (1-based) and page size.

This method calculates the starting index by `(pageNumber - 1) * pageSize`, then skips that many records, and finally limits the result to `pageSize` number of records.

If either `pageNumber` or `pageSize` is less than 1, this method returns an empty RecordSet.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const records = RecordSet.of<Item>([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
]);

const firstPage = records.page(1, 3);
console.log(firstPage.all()); // [{ id: 1 }, { id: 2 }, { id: 3 }]

const secondPage = records.page(2, 3);
console.log(secondPage.all()); // [{ id: 4 }, { id: 5 }, { id: 6 }]
```

#### `RecordSet.prototype.slice`

Use this method to create a shallow copy slice of the records in the record set, extracting records from the specified `start` index up to, but not including, the `end` index.

It operates on the current set of records without applying any filtering.

For filtering, use `.find()` prior to `.slice()`.

```typescript
const records = RecordSet.of([1, 2, 3, 4, 5]);

const sliced = records.slice(1, 3);

console.log(sliced.all()); // [2, 3]

const slicedFromEnd = records.slice(-3, -1);

console.log(slicedFromEnd.all()); // [3, 4]
```

### Ordering

#### `RecordSet.prototype.sort`

Use this method to sort the records with the provided compare function.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
]);

const sorted = records.sort((a, b) => {
  return a.age - b.age;
});

console.log(sorted.all()); // [{ id: 2, name: 'Bob', age: 25 }, { id: 1, name: 'Alice', age: 30 }, { id: 3, name: 'Eve', age: 35 }]
```

#### `RecordSet.prototype.sortBy`

Use this helper to sort the records by key(s) in ascending or descending order.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
]);

const multiSorted = records.sortBy(['name', 'age'], ['asc', 'desc']);

console.log(multiSorted.all()); // sorted by name ascending, age descending
```

#### `RecordSet.prototype.reverse`

Use this method to reverse the order of the records.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const records = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
]);

const reversed = records.reverse();

console.log(reversed.all()); // [{ id: 3, name: 'Eve', age: 35 }, { id: 2, name: 'Bob', age: 25 }, { id: 1, name: 'Alice', age: 30 }]
```

### Transforming

#### `RecordSet.prototype.map`

Use this method to transform all records in the record set and return a new RecordSet of the transformed records.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type User = { id: number; name: string; age: number };

const users = RecordSet.of<User>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]);

const userNames = users.map((user) => {
  return user.name;
});

console.log(userNames.all()); // ['Alice', 'Bob']
```

#### `RecordSet.prototype.flatMap`

Use this method to map each record to zero or more records, then flatten the results into a single new record set.

This is handy for extracting nested arrays or expanding items.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Comment = { id: number; text: string };

type Post = { id: number; comments: Array<Comment> };

const posts = RecordSet.of<Post>([
  {
    id: 1,
    comments: [
      { id: 101, text: 'a' },
      { id: 102, text: 'b' },
    ],
  },
  { id: 2, comments: [{ id: 103, text: 'c' }] },
]);

const comments = posts.flatMap((post) => {
  return post.comments;
});

console.log(comments.all()); // [{ id: 101, text: 'a' }, { id: 102, text: 'b' }, { id: 103, text: 'c' }]
```

#### `RecordSet.prototype.pluck`

Use this method to extract an array of a single field's values from all records in the record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const people = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 35 },
]);

const ages = people.pluck('age');

console.log(ages); // [30, 25, 35]
```

#### `RecordSet.prototype.pick`

Use this method to pick only the specified fields from each record, returning a new RecordSet of records with only those keys.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type User = { id: number; name: string; age: number; email: string };

const users = RecordSet.of<User>([
  { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
]);

const userSummaries = users.pick(['id', 'name']);

console.log(userSummaries.all()); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

#### `RecordSet.prototype.omit`

Use this method to omit the specified fields from each record, returning a new record set of records without those keys.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type User = { id: number; name: string; age: number; password: string };

const users = RecordSet.of<User>([
  { id: 1, name: 'Alice', age: 30, password: 'secret1' },
  { id: 2, name: 'Bob', age: 25, password: 'secret2' },
]);

const safeUsers = users.omit(['password']);

console.log(safeUsers.all()); // [{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 25 }]
```

#### `RecordSet.prototype.select`

Use this method to project each record to include or exclude fields, returning a new record set of records with only those keys:

- String: `'a b -c +d'`.
- Array of strings: `['a', '-b']`.
- Object notation: `{ a: 1, b: 1 }` or `{ c: 0 }`.

Inclusive if any field is positively specified (no `-` or `0`).

Exclusive if only negatives (`-`) or zeros (`0`).

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number; name: string; age: number };

const users = RecordSet.of<Item>([{ id: 1, name: 'Bob', age: 30 }]);

users.select('id name').all(); // [{ id: 1, name: 'Bob' }]

users.select('-age').all(); // [{ id: 1, name: 'Bob' }]
```

#### `RecordSet.prototype.concat`

Use this method to concatenate the current record set with another record set and returns a new combined record set.

This method does not modify the original record sets but creates a new one containing all records of both.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const set1 = RecordSet.of<Item>([{ id: 1 }, { id: 2 }]);

const set2 = RecordSet.of<Item>([{ id: 3 }, { id: 4 }]);

const combined = set1.concat(set2);

console.log(combined.all()); // [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
```

#### `RecordSet.prototype.groupBy`

Use this method to group records by a key derived from each record. It returns a `Map` where keys are group keys and values are record sets of grouped records.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const people = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 25 },
]);

const grouped = people.groupBy((person) => {
  return person.age;
});

console.log(grouped.get(25)?.all()); // [{ id: 2, name: 'Bob', age: 25 }, { id: 3, name: 'Eve', age: 25 }]

console.log(grouped.get(30)?.all()); // [{ id: 1, name: 'Alice', age: 30 }]
```

#### `Recordset.prototype.distinct`

Use this method to get distinct values of a field among records matching the query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Product = { category: string; name: string };

const products = RecordSet.of<Product>([
  { category: 'fruit', name: 'apple' },
  { category: 'vegetable', name: 'carrot' },
  { category: 'fruit', name: 'banana' },
]);

const categories = products.distinct('category');
console.log(categories); // ['fruit', 'vegetable']

const fruitNames = products.distinct('name', { category: 'fruit' });
console.log(fruitNames); // ['apple', 'banana']
```

#### `RecordSet.prototype.reduce`

Use this method to reduce the record set to a single accumulated value.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { name: string; age: number };

const people = RecordSet.of<Person>([
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Eve', age: 35 },
]);

const totalAge = people.reduce((acc, person) => {
  return acc + person.age;
}, 0);

console.log(totalAge); // 90
```

### Mutations

#### `RecordSet.prototype.add`

Use this method to add one or more records to the record set at the specified index.

The insertion index is zero-based. If omitted or out of bounds, new records are appended at the end.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const items = RecordSet.of([{ id: 1 }, { id: 2 }, { id: 3 }]);

// Insert at index 1
const updated = items.add({ id: 99 }, 1);

console.log(updated.all()); // [{ id: 1 }, { id: 99 }, { id: 2 }, { id: 3 }]

// Append by default
const appended = items.add([{ id: 4 }, { id: 5 }]);

console.log(appended.all()); // [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
```

#### `RecordSet.prototype.prepend`

Use this method to add one or more records to the record set at the beggining of the record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const items = RecordSet.of<Item>([{ id: 1 }, { id: 2 }, { id: 3 }]);

const prepended = items.prepend([{ id: 4 }, { id: 5 }]);

console.log(prepended.all()); // [{ id: 4 }, { id: 5 }, { id: 1 }, { id: 2 }, { id: 3 }]
```

#### `RecordSet.prototype.append`

Use this method to add one or more records to the record set at the end of the record set.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Item = { id: number };

const items = RecordSet.of<Item>([{ id: 1 }, { id: 2 }, { id: 3 }]);

const appended = items.append([{ id: 4 }, { id: 5 }]);

console.log(appended.all()); // [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
```

#### `RecordSet.prototype.update`

Use this method to update records in the record set matching the given query by merging the provided update object.

Performs a shallow merge of the update object into matching records.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const users = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 25 },
]);

const updated = users.update({ age: 25 }, { age: 26 });

console.log(updated.all()); // [{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 26 }, { id: 3, name: 'Eve', age: 26 }]
```

#### `RecordSet.prototype.updateOne`

Use this method to update the first record in the record set matching the given query by merging the provided update object.

Performs a shallow merge of the update object into the first matching record.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const users = RecordSet.of<Person>([
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Eve', age: 25 },
]);

const updated = users.updateOne({ age: 25 }, { age: 26 });

// Only first matched record updated
console.log(updated.all()); // [{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 26 }, { id: 3, name: 'Eve', age: 25 }]
```

#### `RecordSet.prototype.remove`

Use this method to remove all records from the record set that match the given query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const items = RecordSet.of<Person>([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Banana' },
  { id: 4, name: 'Cherry' },
]);

// Remove all items with name 'Banana'
const updated = items.remove({ name: 'Banana' });

console.log(updated.all()); // [{ id: 1, name: 'Apple' }, { id: 4, name: 'Cherry' }]
```

#### `RecordSet.prototype.removeOne`

Use this method to remove the first record from the record set that matches the given query.

```typescript
import { RecordSet } from '@future-widget-lab/record-set';

type Person = { id: number; name: string; age: number };

const items = RecordSet.of<Person>([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Banana' },
  { id: 4, name: 'Cherry' },
]);

// Remove the first item with name 'Banana'
const updated = items.removeOne({ name: 'Banana' });

console.log(updated.all()); // [{ id: 1, name: 'Apple' }, { id: 3, name: 'Banana' }, { id: 4, name: 'Cherry' }]
```

## Additional Resources

- [`sift` documentation](https://www.npmjs.com/package/sift)
- [`mingo` documentation](https://www.npmjs.com/package/mingo)

## License

MIT

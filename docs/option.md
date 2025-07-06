# Module Option

Optional values.

```
Option<T> {
    None,
    Some(T),
}
```

## Import

You may import directly from the package root:

```ts
import { None, type Option, Some } from "unwrap-or";
```

or from the specific module path for more precise bundling:

```ts
import { None, type Option, Some } from "unwrap-or/option";
```

## Overview

Type `Option` represents an optional value: every `Option` is either `Some(T)`
and contains a value, or `None`, and does not. `Option` types are very common,
as they have a number of uses:

- initial values
- return values for functions that are not defined over their entire input range
  (partial functions)
- return value for otherwise reporting simple errors, where `None` is returned
  on error
- optional struct fields
- struct fields that can be loaned or "taken"
- optional function arguments
- nullable pointers
- swapping things out of difficult situations

Options are commonly paired with matching to query the presence of a value and
take action, always accounting for the `None` case.

```ts
function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 ? Some(numerator / denominator) : None;
}

let option_num: Option<number> = divide(2.0, 3.0);

if (option_num.is_some()) {
  const value = option.unwrap();
}
```

### Querying the variant

The `is_some` and `is_none` methods return `true` if the `Option` is `Some` or
`None`, respectively.

### Extracting the contained value

These methods extract the contained value in an `Option<T>` when it is the
`Some` variant. If the `Option` is `None`:

- `expect` panics with a provided custom message
- `unwrap` panics with a generic message
- `unwrap_or` returns the provided default value
- `unwrap_or_else` returns the result of evaluating the provided function

### Transforming contained values

- `ok_or` transforms `Some(v)` to `Ok(v)`, and `None` to `Err(err)` using the
  provided default `err` value
- `ok_or_else` transforms `Some(v)` to `Ok(v)`, and `None` to a value of `Err`
  using the provided function
- transpose transposes an `Option` of a `Result` into a `Result` of an `Option`

These methods transform the `Some` variant:

- `filter` calls the provided predicate function on the contained value `t` if
  the `Option` is `Some(t)`, and returns `Some(t)` if the function returns
  `true`; otherwise, returns `None`
- `flatten` removes one level of nesting from an `Option<Option<T>>`
- `map` transforms `Option<T>` to `Option<U>` by applying the provided function
  to the contained value of `Some` and leaving `None` values unchanged

These methods transform `Option<T>` to a value of a possibly different type `U`:

- `map_or` applies the provided function to the contained value of `Some`, or
  returns the provided default value if the `Option` is `None`
- `map_or_else` applies the provided function to the contained value of `Some`,
  or returns the result of evaluating the provided fallback function if the
  `Option` is `None`

### Boolean operators

These methods treat the `Option` as a boolean value, where `Some` acts like
`true` and `None` acts like `false`. There are two categories of these methods:
ones that take an `Option` as input, and ones that take a function as input (to
be lazily evaluated).

The `and`, `or`, and `xor` methods take another `Option` as input, and produce
an `Option` as output. Only the and method can produce an `Option<U>` value
having a different inner type `U` than `Option<T>`.

| method | input     | output    |
| ------ | --------- | --------- |
| `and`  | (ignored) | `None`    |
| `and`  | `None`    | `None`    |
| `and`  | `Some(y)` | `Some(y)` |
| `or`   | `None`    | `None`    |
| `or`   | `Some(y)` | `Some(y)` |
| `or`   | (ignored) | `Some(x)` |
| `xor`  | `None`    | `None`    |
| `xor`  | `Some(y)` | `Some(y)` |
| `xor`  | `None`    | `Some(x)` |
| `xor`  | `Some(y)` | `None`    |

The `and_then` and `or_else` methods take a function as input, and only evaluate
the function when they need to produce a new value. Only the `and_then` method
can produce an `Option<U>` value having a different inner type U than
`Option<T>`.

| `method`   | function input | function result | output    |
| ---------- | -------------- | --------------- | --------- |
| `and_then` | (not provided) | (not evaluated) | `None`    |
| `and_then` | `x`            | `None`          | `None`    |
| `and_then` | `x`            | `Some(y)`       | `Some(y)` |
| `or_else`  | (not provided) | `None`          | `None`    |
| `or_else`  | (not provided) | `Some(y)`       | `Some(y)` |
| `or_else`  | (not provided) | (not evaluated) | `Some(x)` |

## Variants

### Some

```ts
Some<T>;
```

Some value of type `T`.

##### Examples

```ts
let x: Option<number> = Some(42);
```

### None

```ts
None;
```

No value.

##### Examples

```ts
let x: Option<number> = None;
```

## Methods

`Option` provides a wide variety of different methods.

### and

<sub>0.1.0-alpha</sub>

```ts
public and<U>(optb: Option<U>): Option<T | U>;
```

Returns `None` if the option is `None`, otherwise returns `optb`.

Arguments passed to and are eagerly evaluated; if you are passing the result of
a function call, it is recommended to use `and_then`, which is lazily evaluated.

##### Examples

```ts
let x: Option<number>;
let y: Option<string>;

x = Some(2);
y = None;
assert_eq!(x.and(y), None);

x = None;
y = Some("foo");
assert_eq!(x.and(y), None);

x = Some(2);
y = Some("foo");
assert_eq!(x.and(y), Some("foo"));

x = None;
y = None;
assert_eq!(x.and(y), None);
```

### and_then

<sub>0.1.0-alpha</sub>

```ts
public and_then<U>(f: (value: T) => Option<U>): Option<T | U>;
```

Returns `None` if the option is `None`, otherwise calls function `f` with the
wrapped value and returns the result.

Often used to chain fallible operations that may return `None`.

Some languages call this operation `flatmap`.

##### Examples

```ts
let x: Option<string>;
let y: Option<string>;

x = Some("some value");
y = None;
assert_eq!(
  x.and_then(() => y),
  None,
);

x = None;
y = Some("then value");
assert_eq!(
  x.and_then(() => y),
  None,
);

x = Some("some value");
y = Some("then value");
assert_eq!(
  x.and_then(() => y),
  Some("then value"),
);

x = None;
y = None;
assert_eq!(
  x.and_then(() => y),
  None,
);
```

### expect

<sub>0.1.0-alpha</sub>

```ts
public expect(msg: string): T;
```

Returns the contained `Some` value.

Recommend that expect messages are used to describe the reason you expect the
`Option` should be `Some`.

Throws an error if the value is a `None` with a custom message provided by
`msg`.

##### Examples

```ts
let x: Option<string>;

x = Some("value");
assert_eq!(x.expect("should return string value"), "value");

x = None;
assert_err!(
  () => x.expect("should return string value"),
  Error,
  "should return string value",
);
```

### filter

<sub>0.1.0-alpha</sub>

```ts
public filter(predicate: (value: T) => boolean): Option<T>;
```

Returns `None` if the option is `None`, otherwise calls predicate with the
wrapped value and returns:

- `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
- `None` if predicate returns `false`

##### Examples

```ts
function is_even(n: number): boolean {
  return n % 2 == 0;
}

assert_eq!(None.filter(is_even), None);
assert_eq!(Some(3).filter(is_even), None);
assert_eq!(Some(4).filter(is_even), Some(4));
```

### flatten

<sub>0.3.0-alpha</sub>

```ts
public flatten<U>(this: Option<Option<U>>): Option<U>;
```

Converts from `Option<Option<T>>` to `Option<T>`.

Flattening only removes one level of nesting at a time.

##### Examples

```ts
let x: Option<Option<number>>;

x = Some(Some(6));
assert_eq!(x.flatten(), Some(6));

x = Some(None);
assert_eq!(x.flatten(), None);

x = None;
assert_eq!(x.flatten(), None);
```

### inspect

<sub>0.1.0-alpha</sub>

```ts
public inspect(f: (value: T) => void): Option<T>;
```

Calls a function with a reference to the contained value if `Some`.

Returns the original option.

##### Examples

```ts
function get<T>(arr: T[], idx: number): Option<T> {
  const item = arr.at(idx);
  return item !== undefined ? Some(item) : None;
}

const list = [1, 2, 3, 4, 5];

let has_inspected = false;

let x = get(list, 2).inspect((_v) => {
  has_inspected = true;
});

assert_eq!(x, Some(3));
assert_eq!(has_inspected, true);
```

### is_none

<sub>0.1.0-alpha</sub>

```ts
public is_none(): boolean;
```

Returns `true` if the option is a `None` value.

##### Examples

```ts
let x: Option<number>;

x = Some(2);
assert_eq!(x.is_none(), false);

x = None;
assert_eq!(x.is_none(), true);
```

### is_none_or

<sub>0.1.0-alpha</sub>

```ts
public is_none_or(f: (value: T) => boolean): boolean;
```

Returns `true` if the option is a `None` or the value inside of it matches a
predicate.

##### Examples

```ts
let x: Option<number>;

x = Some(2);
assert_eq!(
  x.is_none_or((v) => v > 1),
  true,
);

x = Some(0);
assert_eq!(
  x.is_none_or((v) => v > 1),
  false,
);

x = None;
assert_eq!(
  x.is_none_or((v) => v > 1),
  true,
);
```

### is_some

<sub>0.1.0-alpha</sub>

```ts
public is_some(): boolean;
```

Returns `true` if the option is a `Some` value.

##### Examples

```ts
let x: Option<number>;

x = Some(2);
assert_eq!(x.is_some(), true);

x = None;
assert_eq!(x.is_some(), false);
```

### is_some_and

<sub>0.1.0-alpha</sub>

```ts
public is_some_and(f: (value: T) => boolean): boolean;
```

Checks if the `Option` is `Some` and the value satisfies a predicate.

##### Examples

```ts
let x: Option<number>;

x = Some(2);
assert_eq!(
  x.is_some_and((v) => v > 1),
  true,
);

x = Some(0);
assert_eq!(
  x.is_some_and((v) => v > 1),
  false,
);

x = None;
assert_eq!(
  x.is_some_and((v) => v > 1),
  false,
);
```

### map

<sub>0.1.0-alpha</sub>

```ts
public map<U>(f: (value: T) => U): Option<T | U>;
```

Maps an `Option<T>` to `Option<U>` by applying a function `f` to a contained
value (if `Some`) or returns `None` (if `None`).

##### Examples

```ts
let x: Option<string>;

x = Some("Hello, World!");
assert_eq!(
  x.map((s) => s.length),
  Some(13),
);

x = None;
assert_eq!(
  x.map((s) => s.length),
  None,
);
```

### map_or

<sub>0.1.0-alpha</sub>

```ts
public map_or<U>(default_value: U, f: (value: T) => U): U;
```

Returns the provided default result (if none), or applies a function `f` to the
contained value (if any).

If you are passing the result of a function call, it is recommended to use
`map_or_else`, which is lazily evaluated.

##### Examples

```ts
let x: Option<string>;

x = Some("foo");
assert_eq!(
  x.map_or(42, (v) => v.length),
  3,
);

x = None;
assert_eq!(
  x.map_or(42, (v) => v.length),
  42,
);
```

### map_or_else

<sub>0.1.0-alpha</sub>

```ts
public map_or_else<U>(default_f: () => U, f: (value: T) => U): U;
```

Computes a default function result (if none), or applies a different function to
the contained value (if any).

##### Examples

```ts
const k = 21
let x: Option<string>

x = Some("foo")
assert_eq!(x.map_or_else(() => 2 k, (v) => v.length), 3)

x = None
assert_eq!(x.map_or_else(() => 2 k, (v) => v.length), 42)
```

### ok_or

<sub>0.2.0-beta</sub>

```ts
public ok_or<E>(err: E): Result<T, E>;
```

Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(value)` to
`Ok(value)` and `None` to `Err(err)`.

Arguments passed to `ok_or` are eagerly evaluated; if you are passing the result
of a function call, it is recommended to use`ok_or_else`, which is lazily
evaluated.

##### Examples

```ts
let x: Option<number>;
let y: Result<number, string>;

x = Some(42);
y = x.ok_or("Not found");
assert_eq!(y, Ok(42));

x = None;
y = x.ok_or("Not found");
assert_eq!(y, Err("Not found"));
```

<!-- // TODO: ok_or_else<E, F>(err: F): Result<T, E> -->

### or

<sub>0.1.0-alpha</sub>

```ts
public or(optb: Option<T>): Option<T>;
```

Returns the option if it contains a value, otherwise returns `optb`.

Arguments passed to or are eagerly evaluated; if you are passing the result of a
function call, it is recommended to use `or_else`, which is lazily evaluated.

##### Examples

```ts
let x: Option<number>;
let y: Option<number>;

x = Some(2);
y = None;
assert_eq!(x.or(y), Some(2));

x = None;
y = Some(100);
assert_eq!(x.or(y), Some(100));

x = Some(2);
y = Some(100);
assert_eq!(x.or(y), Some(2));

x = None;
y = None;
assert_eq!(x.or(y), None);
```

### or_else

<sub>0.1.0-alpha</sub>

```ts
public or_else(f: () => Option<T>): Option<T>;
```

Returns the option if it contains a value, otherwise calls `f` and returns the
result.

##### Examples

```ts
let x: Option<string>;
let y: Option<string>;

x = Some("barbarians");
y = Some("vikings");
assert_eq!(
  x.or_else(() => y),
  Some("barbarians"),
);

x = None;
y = Some("vikings");
assert_eq!(
  x.or_else(() => y),
  Some("vikings"),
);

x = None;
y = None;
assert_eq!(
  x.or_else(() => y),
  None,
);
```

<!-- // TODO: transpose(): Result<Option<T>, E> -->

### unwrap

<sub>0.1.0-alpha</sub>

```ts
public unwrap(): T;
```

Returns the contained `Some` value. Panics if it is `None`.

Because this function may throw a TypeError, its use is generally discouraged.
Errors are meant for unrecoverable errors, and do abort the entire program.

Instead, prefer to use try/catch, promise or pattern matching and handle the
`None` case explicitly, or call `unwrap_or` or `unwrap_or_else`.

##### Examples

```ts
let x: Option<string>;

x = Some("air");
assert_eq!(x.unwrap(), "air");

x = None;
assert_err!(
  () => x.unwrap(),
  TypeError,
  "Called Option.unwrap() on a None value",
);
```

### unwrap_or

<sub>0.1.0-alpha</sub>

```ts
public unwrap_or(default_value: T): T;
```

Returns the contained `Some` value or a provided default value.

Arguments passed to `unwrap_or` are eagerly evaluated; if you are passing the
result of a function call, it is recommended to use `unwrap_or_else`, which is
lazily evaluated.

##### Examples

```ts
let x: Option<number>;

x = Some(42);
assert_eq!(x.unwrap_or(1), 42);

x = None;
assert_eq!(x.unwrap_or(1), 1);
```

### unwrap_or_else

<sub>0.1.0-alpha</sub>

```ts
public unwrap_or_else(f: () => T): T;
```

Returns the contained `Some` value or computes it from a closure.

Useful for expensive default computations.

##### Examples

```ts
const k = 10;
let x: Option<number>;

x = Some(4);
assert_eq!(x.unwrap_or_else(() => 2 k), 4);

x = None
assert_eq!(x.unwrap_or_else(() => 2 k), 20);
```

### xor

<sub>0.1.0-alpha</sub>

```ts
public xor(optb: Option<T>): Option<T>;
```

Returns `Some` if exactly one of itself, `optb` is `Some`, otherwise returns
`None`.

##### Examples

```ts
let x: Option<number>;
let y: Option<number>;

x = Some(2);
y = None;
assert_eq!(x.xor(y), Some(2));

x = None;
y = Some(100);
assert_eq!(x.xor(y), Some(100));

x = Some(2);
y = Some(100);
assert_eq!(x.xor(y), None);

x = None;
y = None;
assert_eq!(x.xor(y), None);
```

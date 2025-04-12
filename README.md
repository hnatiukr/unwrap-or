<p align="center">
    <img src="logo.svg" height=60>
</p>

<h1 align="center">Unwrap OR</h1>

<p align="center">
A TypeScript implementation of Rust's Option and Result types.
</p>

<p align="center">
  <sub>
      no deps | tree-shakeable | side-effect free
  </sub>
</p>

<p align="center">
  <a href="https://github.com/hnatiukr/unwrap-or/actions/workflows/workflow.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/hnatiukr/unwrap-or/workflow.yml?color=orange&style=for-the-badge" alt="Workflow CI">
  </a>
   <a href="https://www.npmjs.com/package/unwrap-or">
       <img src="https://img.shields.io/github/v/release/hnatiukr/unwrap-or?color=orange&style=for-the-badge" alt="Release version">
   </a>
  <a href="https://github.com/hnatiukr/unwrap-or/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/hnatiukr/unwrap-or?color=orange&style=for-the-badge" alt="License MIT">
  </a>
</p>

It is a playground library that closely mirrors **Rust**'s
[Option](https://doc.rust-lang.org/std/option/enum.Option.html) and
[Result](https://doc.rust-lang.org/std/result/enum.Result.html) API. While
created primarily for fun and learning, it's robust enough for real-world
applications. It allows for safer, more expressive handling of optional values
through a monadic interface.

Use it to:

- eliminate `null` checks
- make optional logic explicit
- chain transformations on values that might not exist
- handle errors gracefully

The name `unwrap-or` is a playful reference to both the `unwrap_or` method found
in the `Option`/`Result` types, and a hint at the package's contents - _"-OR"_
standing for **O**ption and **R**esult types. It also cleverly references the
logical `OR` operation, reflecting how these monadic types encapsulate one of
two possible states - either `Some` or `None` for `Option`; either `Ok` or `Err`
for `Result`.

## Installation

Via npm:

```sh
# npm
npm install unwrap-or
```

You can also use your favorite package manager:

```sh
# pnpm
pnpm add unwrap-or

# bun
bun add unwrap-or

# yarn
yarn add unwrap-or

# deno
deno add jsr:@lab/unwrap-or
```

## Documentation

- [Option](#option)
  - [.and](#and)
  - [.and_then](#and_then)
  - [.expect](#expect)
  - [.filter](#filter)
  - [.inspect](#inspect)
  - [.is_none](#is_none)
  - [.is_none_or](#is_none_or)
  - [.is_some](#is_some)
  - [.is_some_and](#is_some_and)
  - [.map](#map)
  - [.map_or](#map_or)
  - [.map_or_else](#map_or_else)
  - [ok_or](#ok_or)
  - [ok_or_else](#ok_or_else)
  - [.or](#or)
  - [.or_else](#or_else)
  - [transpose](#transpose)
  - [.unwrap](#unwrap)
  - [.unwrap_or](#unwrap_or)
  - [.unwrap_or_else](#unwrap_or_else)
  - [.xor](#xor)
- [Result](#Result)

## Option

### and

```rust
pub fn and<U>(optb: Option<U>): Option<T> | Option<U>
```

Returns `None` if the option is `None`, otherwise returns `optb`.

Arguments passed to and are eagerly evaluated; if you are passing the result of
a function call, it is recommended to use `and_then`, which is lazily evaluated.

**Example**

```ts
let x: Option<number>;
let y: Option<string>;

x = Some(2);
y = None;
assertEquals(x.and(y), y);

x = None;
y = Some("foo");
assertEquals(x.and(y), x);

x = Some(2);
y = Some("foo");
assertEquals(x.and(y), y);

x = None;
y = None;
assertEquals(x.and(y), x);
```

### and_then

```rust
pub fn and_then<U>(f: (value: T) => Option<U>): Option<T> | Option<U>
```

Returns `None` if the option is `None`, otherwise calls function `f` with the
wrapped value and returns the result.

Often used to chain fallible operations that may return `None`.

Some languages call this operation `flatmap`.

```ts
let x: Option<string>;
let y: Option<string>;

x = Some("some value");
y = None;
assertEquals(
  x.and_then(() => y),
  y,
);

x = None;
y = Some("then value");
assertEquals(
  x.and_then(() => y),
  x,
);

x = Some("some value");
y = Some("then value");
assertEquals(
  x.and_then(() => y),
  y,
);

x = None;
y = None;
assertEquals(
  x.and_then(() => y),
  x,
);
```

### expect

```rust
pub fn expect(msg: string): T
```

Returns the contained `Some` value. Throws an error if the value is a `None`
with a custom message provided by `msg`.

Recommend that expect messages are used to describe the reason you expect the
`Option` should be `Some`.

```ts
let x: Option<string>;

x = Some("value");
assertEquals(x.expect("should rerurn string value"), "value");

x = None;
assertThrows(() => x.expect("should rerurn string value"), Error);
```

### filter

```rust
pub fn filter(predicate: (value: T) => boolean): Option<T>
```

Returns `None` if the option is `None`, otherwise calls predicate with the
wrapped value and returns:

- `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
- `None` if predicate returns `false`

```ts
function is_even(n: number): boolean {
  return n % 2 == 0;
}

assertEquals(None.filter(is_even), None);
assertEquals(Some(3).filter(is_even), None);
assertEquals(Some(4).filter(is_even), Some(4));
```

### inspect

```rust
pub fn inspect(f: (value: T) => void): Option<T>
```

Calls a function with a reference to the contained value if `Some`.

Returns the original option.

```ts
function get<T>(arr: T[], idx: number): Option<T> {
  const item = arr.at(idx);
  return item !== undefined ? Some(item) : None;
}

const list = [1, 2, 3, 4, 5];

const x = get(list, 1)
  .inspect((v) => console.log("got: " + v))
  .expect("list should be long enough");

assertEquals(x, 2);
```

### is_none

```rust
pub fn is_none(): boolean
```

Returns `true` if the option is a `None` value.

```ts
let x: Option<number>;

x = Some(2);
assertEquals(x.is_none(), false);

x = None;
assertEquals(x.is_none(), true);
```

### is_none_or

```rust
pub fn is_none_or(f: (value: T) => boolean): boolean
```

Returns `true` if the option is a `None` or the value inside of it matches a
predicate.

```ts
let x: Option<number>;

x = Some(2);
assertEquals(
  x.is_none_or((v) => v > 1),
  true,
);

x = Some(0);
assertEquals(
  x.is_none_or((v) => v > 1),
  false,
);

x = None;
assertEquals(
  x.is_none_or((v) => v > 1),
  true,
);
```

### is_some

```rust
pub fn is_some(): boolean
```

Returns `true` if the option is a `Some` value.

```ts
let x: Option<number>;

x = Some(2);
assertEquals(x.is_some(), true);

x = None;
assertEquals(x.is_some(), false);
```

### is_some_and

```rust
pub fn is_some_and(f: (value: T) => boolean): boolean
```

Checks if the `Option` is `Some` and the value satisfies a predicate

```ts
let x: Option<number>;

x = Some(2);
assertEquals(
  x.is_some_and((v) => v > 1),
  true,
);

x = Some(0);
assertEquals(
  x.is_some_and((v) => v > 1),
  true,
);

x = None;
assertEquals(
  x.is_some_and((v) => v > 1),
  false,
);
```

### map

```rust
pub fn map<U>(f: (value: T) => U): Option<U>
```

Maps an `Option<T>` to `Option<U>` by applying a function `f` to a contained
value (if `Some`) or returns `None` (if `None`).

```ts
let x: Option<string>;

x = Some("Hello, World!");
assertEquals(
  x.map((s) => s.length),
  Some(13),
);

x = None;
assertEquals(
  x.map((s) => s.length),
  None,
);
```

### map_or

```rust
pub fn map_or<U>(default_value: U, f: (value: T) => U): U
```

Returns the provided default result (if none), or applies a function `f` to the
contained value (if any).

If you are passing the result of a function call, it is recommended to use
`map_or_else`, which is lazily evaluated.

```ts
let x: Option<string>;

x = Some("foo");
assertEquals(
  x.map_or(42, (v) => v.length),
  3,
);

x = None;
assertEquals(
  x.map_or(42, (v) => v.length),
  42,
);
```

### map_or_else

```rust
pub fn map_or_else<U>(default_f: () => U, f: (value: T) => U): U
```

Computes a default function result (if none), or applies a different function to
the contained value (if any).

```ts
const k = 21;
let x: Option<string>;

x = Some("foo");
assertEquals(
  x.map_or_else(
    () => 2 * k,
    (v) => v.length,
  ),
  3,
);

x = None;
assertEquals(
  x.map_or_else(
    () => 2 * k,
    (v) => v.length,
  ),
  42,
);
```

### or

```rust
pub fn or(optb: Option<T>): Option<T>
```

Returns the option if it contains a value, otherwise returns `optb`.

Arguments passed to or are eagerly evaluated; if you are passing the result of a
function call, it is recommended to use `or_else`, which is lazily evaluated.

```ts
let x: Option<number>;
let y: Option<number>;

x = Some(2);
y = None;
assertEquals(x.or(y), x);

x = None;
y = Some(100);
assertEquals(x.or(y), y);

x = Some(2);
y = Some(100);
assertEquals(x.or(y), x);

x = None;
y = None;
assertEquals(x.or(y), x);
```

### or_else

```rust
pub fn or_else(f: () => Option<T>): Option<T>
```

Returns the option if it contains a value, otherwise calls `f` and returns the
result.

```ts
let x: Option<string>;
let y: Option<string>;

x = Some("barbarians");
y = Some("vikings");
assertEquals(
  x.or_else(() => y),
  x,
);

x = None;
y = Some("vikings");
assertEquals(
  x.or_else(() => y),
  y,
);

x = None;
y = None;
assertEquals(
  x.or_else(() => y),
  x,
);
```

### unwrap

```rust
pub fn unwrap(): T
```

Returns the contained `Some` value. Panics if it is `None`.

Because this function may throw a TypeError, its use is generally discouraged.
Errors are meant for unrecoverable errors, and do abort the entire program.

Instead, prefer to use try/catch, promise or pattern matching and handle the
`None` case explicitly, or call `unwrap_or` or `unwrap_or_else`.

```ts
let x: Option<string>;

x = Some("air");
assertEquals(x.unwrap(), "air");

x = None;
assertThrows(() => x.unwrap(), TypeError);
```

### unwrap_or

```rust
pub fn unwrap_or(default_value: T): T
```

Returns the contained `Some` value or a provided default value.

Arguments passed to `unwrap_or` are eagerly evaluated; if you are passing the
result of a function call, it is recommended to use `unwrap_or_else`, which is
lazily evaluated.

```ts
let x: Option<number>;

x = Some(42);
assertEquals(x.unwrap_or(1), 42);

x = None;
assertEquals(x.unwrap_or(1), 1);
```

### unwrap_or_else

```rust
pub fn unwrap_or_else(f: () => T): T
```

Returns the contained Some value or computes it from a closure.

Useful for expensive default computations.

```ts
const k = 10;
let x: Option<number>;

x = Some(4);
assertEquals(
  x.unwrap_or_else(() => 2 * k),
  4,
);

x = None;
assertEquals(
  x.unwrap_or_else(() => 2 * k),
  20,
);
```

### xor

```rust
pub fn xor(optb: Option<T>): Option<T>
```

Returns `Some` if exactly one of itself, `optb` is `Some`, otherwise returns
`None`.

```ts
let x: Option<number>;
let y: Option<number>;

x = Some(2);
y = None;
assertEquals(x.xor(y), x);

x = None;
y = Some(100);
assertEquals(x.xor(y), y);

x = Some(2);
y = Some(100);
assertEquals(x.xor(y), None);

x = None;
y = None;
assertEquals(x.xor(y), y);
```

## Result

coming soon...

## License

Made by a human being, not LLM.

Copyright © 2025 Roman Hnatiuk

Licensed under [MIT](./LICENSE).

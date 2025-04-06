<p align="center">
    <img src="https://raw.githubusercontent.com/hnatiukr/unwrap-or/main/logo.svg" height=120>
</p>

<h1 align="center">Unwrap OR</h1>

<p align="center">
A TypeScript implementation of Rust's Option and Result types.
</p>

<p align="center">
  <sub>
      <1kB | no deps | tree-shakeable | side-effect free
  </sub>
</p>

<p align="center">
  <a href="https://github.com/hnatiukr/unwrap-or/actions/workflows/workflow.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/hnatiukr/unwrap-or/workflow.yml?color=blue&style=for-the-badge" alt="Workflow CI">
  </a>
   <a href="https://www.npmjs.com/package/unwrap-or">
       <img src="https://img.shields.io/github/v/release/hnatiukr/unwrap-or?color=blue&style=for-the-badge" alt="Release version">
   </a>
  <a href="https://github.com/hnatiukr/unwrap-or">
      <img src="https://img.shields.io/github/license/hnatiukr/unwrap-or?color=blue&style=for-the-badge" alt="License">
  </a>
</p>

## Motivation

It is a playground library that closely mirrors **Rust**'s [Option](https://doc.rust-lang.org/std/option/enum.Option.html) and [Result](https://doc.rust-lang.org/std/result/enum.Result.html) API. While created primarily for fun and learning, it's robust enough for real-world applications. It allows for safer, more expressive handling of optional values through a monadic interface.

Use it to:

- eliminate `null` checks
- make optional logic explicit
- chain transformations on values that might not exist
- handle errors gracefully

The name `unwrap-or` is a playful reference to both the `unwrap_or` method found in the `Option`/`Result` types, and a hint at the package's contents - _"-OR"_ standing for **O**ption and **R**esult types. It also cleverly references the logical `OR` operation, reflecting how these monadic types encapsulate one of two possible states - either `Some` or `None` for `Option`; either `Ok` or `Err` for `Result`.

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
deno add jsr:@lambda/unwrap-or
```

## Option

`Option` type module - provides a type-safe alternative to `null` or `undefined`. It represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not. This module provides a more expressive and safer way to handle potentially missing values compared to `null`/`undefined`.

### expect

Extracts the value from the `Option` if it is `Some`, or throws with the provided message.

```ts
const some = Some(42);
some.expect("Failed to get value"); // 42

const none = None;
none.expect("Failed to get user configuration"); // Throws Error with message "Failed to get user configuration"
```

### filter

Filters an Option based on a predicate function. Returns `Some` if the `Option` is `Some` and the predicate returns `true`, otherwise `None`.

```ts
const some = Some(42);
some.filter((x) => x > 40); // Some(42)
some.filter((x) => x < 40); // None

const none = None;
none.filter((x) => true); // None
```

### is_none

Checks if the `Option` is a `None`.

```ts
const some = Some(42);
some.is_none(); // false

const none = None;
some.is_none(); // true
```

### is_none_or

Checks if the `Option` is `None` or the value satisfies a predicate.

```ts
const some = Some(42);
some.is_none_or((x) => x > 30); // true
some.is_none_or((x) => x < 30); // false

const value = None;
value.is_none_or((x) => false); // true (always true for `None`)
```

### is_some

Checks if the `Option` is a `Some`.

```ts
const some = Some(42);
some.is_some(); // true

const none = None;
some.is_some(); // false
```

### is_some_and

Checks if the `Option` is `Some` and the value satisfies a predicate.

```ts
const some = Some(42);
some.is_some_and((x) => x > 30); // true
some.is_some_and((x) => x < 30); // false

const none = None;
none.is_some_and((x) => true); // false (always false for `None`)
```

### map

Transforms the `Option`'s value if it is `Some`, or throws if `None`.

```ts
const some = Some(42);
some.map((x) => x.toString()); // "42"

const none = None;
none.map((x) => x.toString()); // ! Throws TypeError
```

### map_or

Transforms the `Option`'s value if it is `Some`, or returns the provided default value if `None`.

```ts
const some = Some(42)
some.map_or(x => x \* 2, 0) // 84

const none = None
none.map_or(x => x \* 2, 0) // 0
```

### toString

Returns a string representation of the `Option`.

```ts
Some(42).toString(); // 'Some(42)'
None.toString(); // 'None'
```

### unwrap

Extracts the value from the `Option` if it is `Some`.

```ts
const some = Some(42);
some.unwrap(); // 42

const none = None;
none.unwrap(); // Throws TypeError: Attempted to unwrap a "None" value
```

### unwrap_or

Extracts the value from the `Option` if it is `Some`, or returns the default value if `None`.

```ts
const some = Some(42);
some.unwrap_or(1); // 42

const none = None;
none.unwrap_or(1); // 1
```

### unwrap_or_else

Extracts the value from the `Option` if it is `Some`, or lazy computes a default value using the provided function. Useful for expensive default computations.

```ts
const some = Some(42);
some.unwrap_or_else(() => expensiveCalculation()); // 42

const none = None;
none.unwrap_or_else(() => expensiveCalculation()); // result of expensiveCalculation()
```

## Result

coming soon...

## License

Made by a human being, not LLM.

Copyright © 2025 Roman Hnatiuk

Licensed under [MIT](./LICENSE).

---
slug: /
title: Overview
id: overview
sidebar_position: 1
---

It is a TypeScript implementation of Rust's Option and Result types.

It is a playground library that closely mirrors **Rust**'s [Option](https://doc.rust-lang.org/std/option/enum.Option.html) and [Result](https://doc.rust-lang.org/std/result/enum.Result.html) API. While created primarily for fun and learning, it's robust enough for real-world applications. It allows for safer, more expressive handling of optional values through a monadic interface. Snake_case is used for the plausibility of the original.

The name `unwrap-or` is a playful reference to both the `unwrap_or` method found in the `Option`/`Result` types, and a hint at the package's contents - _"-OR"_ standing for **O**ption and **R**esult types. It also cleverly references the logical `OR` operation, reflecting how these monadic types encapsulate one of two possible states - either `Some` or `None` for `Option`; either `Ok` or `Err` for `Result`.

## Installation

Via npm:

```sh
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
deno add npm:unwrap-or
```

## Modules

JavaScript/TypeScript use `null` or `undefined` types to represent empty outputs, and exceptions to handle errors. Instead, there are two special generic variants - `Option` and `Result` could be used to deal with above cases.

### Option

Optional values.

Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.

#### Basic usages

```ts
import { type Option, Some, None } from "unwrap-or/option";
```

When writing a function or data type:

- if an argument of the function is optional
- if the function is non-void and if the output it returns can be empty
- if the value of a property of the data type can be empty

```ts
interface Bio {
  name: string;
  middle_name: Option<string>;
  last_name: string;
}
```

```ts
function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 ? Some(numerator / denominator) : None;
}
```

See the [module level documentation](/option) for more.

### Result

Error handling with the `Result` type.

Type `Result` is used for returning and propagating errors: every `Result` is either `Ok` - representing success and containing a value, or `Err` - representing error and containing an error value.

#### Basic usages

```ts
import { type Result, Ok, Err } from "unwrap-or/result";
```

If a function can produce an error, by combining the data type of the valid output and the data type of the error.

```ts
functuion invariant(predicate: boolean, message: string): Result<boolean, message> {
  return predicate ? Ok(predicate) : Err(message);
}
```

See the [module level documentation](/result) for more.

## Inspirations

- [fnts](https://github.com/drizzer14/fnts) - minimal functional programming utilities for TypeScript & JavaScript inspired by the programming language Haskell.

- [ts-expression](https://github.com/hnatiukr/ts-expression) - pair constructor, binary representation, a minimal implementation of `Lisp`'s symbolic expressions (`s-expressions`) for TypeScript.

## License

Made by a human being, not LLM.

Copyright © 2025 Roman Hnatiuk

Licensed under [MIT](https://github.com/hnatiukr/unwrap-or/blob/main/LICENSE).

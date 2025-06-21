<p align="center">
    <img src="logo.svg" height=60>
</p>

<h1 align="center">
Unwrap OR
</h1>

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

It is a playground library that closely mirrors **Rust**'s [Option](https://doc.rust-lang.org/std/option/enum.Option.html) and [Result](https://doc.rust-lang.org/std/result/enum.Result.html) API. While created primarily for fun and learning, it's robust enough for real-world applications. It allows for safer, more expressive handling of optional values through a monadic interface. Snake_case is used for the plausibility of the original.

Use it to:

- eliminate `null` checks
- make optional logic explicit
- chain transformations on values that might not exist
- handle errors gracefully

The name `unwrap-or` is a playful reference to both the `unwrap_or` method found in the `Option`/`Result` types, and a hint at the package's contents - _"-OR"_ standing for **O**ption and **R**esult types. It also cleverly references the logical `OR` operation, reflecting how these monadic types encapsulate one of two possible states - either `Some` or `None` for `Option`; either `Ok` or `Err` for `Result`.

## Installation

Via npm:

```shell
npm install unwrap-or
```

You can also use your favorite package manager:

```shell
# pnpm
pnpm add unwrap-or

# bun
bun add unwrap-or

# yarn
yarn add unwrap-or

# deno
deno add npm:unwrap-or
```

## Overview

The full API documentation will be added later, but you can already explore the source code in the meantime.

### Option

Optional values.

Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.

```ts
import { type Option, Some, None } from "unwrap-or/option";

function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 ? Some(numerator / denominator) : None;
}

let option_num = divide(2.0, 3.0);
```

### Result

Error handling with the `Result` type.

Type `Result` is used for returning and propagating errors: every `Result` is either `Ok` - representing success and containing a value, or `Err` - representing error and containing an error value.

```ts
import { type Result, Ok, Err } from "unwrap-or/result";

let result_data: Result<string, unknown>;

try {
  const data = await fs.readFile("/Users/joe/test.txt", { encoding: "utf8" });
  result_data = Ok(data);
} catch (err) {
  result_data = Err(err);
}
```

## Inspirations

- [fnts](https://github.com/drizzer14/fnts) - minimal functional programming utilities for TypeScript & JavaScript inspired by the `fantasy-land` specification and `Haskell` programming language.

- [ts-expression](https://github.com/hnatiukr/ts-expression) - pair constructor, binary representation, a minimal implementation of `Lisp`'s symbolic expressions (`s-expressions`) for TypeScript.

## License

Made by a human being, not LLM.

Copyright © 2025 Roman Hnatiuk

Licensed under [MIT](./LICENSE).

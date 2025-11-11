<p align="center">
    <img src="https://codeberg.org/hnatiukr/unwrap-or/raw/branch/main/logo.svg" width="120" height="100">
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
    <a href="https://jsr.io/@lab/unwrap-or">
      <img src="https://jsr.io/badges/@lab/unwrap-or" alt="version" />
    </a>
    <a href="https://jsr.io/@lab/unwrap-or">
      <img src="https://jsr.io/badges/@lab/unwrap-or/score" alt="score" />
    </a>
</p>

It is a playground library that closely mirrors **Rust**'s
[Option](https://doc.rust-lang.org/std/option/enum.Option.html) and
[Result](https://doc.rust-lang.org/std/result/enum.Result.html) API. While
created primarily for fun and learning, it's robust enough for real-world
applications. It allows for safer, more expressive handling of optional values
through a monadic interface. Snake_case is used for the plausibility of the
original.

Use it to:

- eliminate `null` checks
- make optional logic explicit
- chain transformations on values that might not exist
- handle errors gracefully

The name `unwrap-or` is a reference to the `unwrap_or` method in the
`Option`/`Result` types and a combination of the first letters _"-OR"_ of two
monads for **O**ption and **R**esult types. It also relfects the logical `OR`
operation reflecting two possible states.

## Installation

Via deno:

```shell
deno add jsr:@lab/unwrap-or
```

You can also use your favorite package manager:

```shell
# pnpm
pnpm i jsr:@lab/unwrap-or

# npm
npx jsr add @lab/unwrap-or

# bun
bunx jsr add @lab/unwrap-or

# yarn
yarn add jsr:@lab/unwrap-or
```

## Overview

See the documentation for **unwrap-or** usage, module specifications and
API/methods details:

- [Option](https://jsr.io/@lab/unwrap-or/doc/option)
- [Result](https://jsr.io/@lab/unwrap-or/doc/result)

## Inspirations

- [fnts](https://github.com/drizzer14/fnts) - minimal functional programming
  utilities for TypeScript & JavaScript inspired by the programming language
  Haskell.

- [ts-expression](https://github.com/hnatiukr/ts-expression) - pair constructor,
  binary representation, a minimal implementation of `Lisp`'s symbolic
  expressions (`s-expressions`) for TypeScript.

## License

Made by a human being, not LLM.

Copyright © 2025 Roman Hnatiuk

Licensed under [MIT](./LICENSE).

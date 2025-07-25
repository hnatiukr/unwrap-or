<p align="center">
    <img src="https://raw.githubusercontent.com/hnatiukr/unwrap-or/main/logo.svg" width="120" height="100">
</p>

<h1 align="center">
Unwrap OR
</h1>

<p align="center">
A TypeScript implementation of Rust's Option and Result types.
</p>

<p align="center">
  <sub>
      no deps | tree-shakeable | side-effect free | < 1KB gzipped
  </sub>
</p>

<p align="center">
  <a href="https://github.com/hnatiukr/unwrap-or/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/hnatiukr/unwrap-or/ci.yml?color=orange&style=for-the-badge" alt="Workflow CI">
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

Via npm:

```shell
npm install unwrap-or
```

You can also use your favorite package manager:

```shell
# pnpm
pnpm add unwrap-or

# deno
deno add jsr:@lab/unwrap-or

# bun
bun add unwrap-or

# yarn
yarn add unwrap-or
```

## Overview

See the documentation for **unwrap-or** usage, module specifications and
API/methods details:

- [Option](https://github.com/hnatiukr/unwrap-or/blob/main/docs/option.md)
- [Result](https://github.com/hnatiukr/unwrap-or/blob/main/docs/result.md)

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

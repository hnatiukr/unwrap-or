---
id: option
slug: /option
title: Module option
sidebar_label: Module
sidebar_position: 1
---

Optional values.

```
Option<T> {
    None,
    Some(T),
}
```

Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not. `Option` types are very common, as they have a number of uses:

- initial values
- return values for functions that are not defined over their entire input range (partial functions)
- return value for otherwise reporting simple errors, where `None` is returned on error
- optional struct fields
- struct fields that can be loaned or “taken”
- optional function arguments
- nullable pointers
- swapping things out of difficult situations

`Option`s are commonly paired with matching to query the presence of a value and take action, always accounting for the `None` case.

```ts
import { type Option, Some, None } from "unwrap-or/option";

function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 ? Some(numerator / denominator) : None;
}

let option_num: Option<number> = divide(2.0, 3.0);

if (option_num.is_some()) {
  const value = option.unwrap();
}
```

## Method overview

In addition to working with pattern matching, Option provides a wide variety of different methods.

### Querying the variant

The `is_some` and `is_none` methods return `true` if the `Option` is `Some` or `None`, respectively.

### Extracting the contained value

These methods extract the contained value in an `Option<T>` when it is the `Some` variant. If the `Option` is `None`:

- `expect` panics with a provided custom message
- `unwrap` panics with a generic message
- `unwrap_or` returns the provided default value
- `unwrap_or_else` returns the result of evaluating the provided function

### Transforming contained values

- `ok_or` transforms `Some(v)` to `Ok(v)`, and `None` to `Err(err)` using the provided default `err` value
- `ok_or_else` transforms `Some(v)` to `Ok(v)`, and `None` to a value of `Err` using the provided function
- transpose transposes an `Option` of a `Result` into a `Result` of an `Option`

These methods transform the `Some` variant:

- `filter` calls the provided predicate function on the contained value `t` if the `Option` is `Some(t)`, and returns `Some(t)` if the function returns `true`; otherwise, returns `None`
- `flatten` removes one level of nesting from an `Option<Option<T>>`
- `map` transforms `Option<T>` to `Option<U>` by applying the provided function to the contained value of `Some` and leaving `None` values unchanged

These methods transform `Option<T>` to a value of a possibly different type `U`:

- `map_or` applies the provided function to the contained value of `Some`, or returns the provided default value if the `Option` is `None`
- `map_or_else` applies the provided function to the contained value of `Some`, or returns the result of evaluating the provided fallback function if the `Option` is `None`

### Boolean operators

These methods treat the `Option` as a boolean value, where `Some` acts like `true` and `None` acts like `false`. There are two categories of these methods: ones that take an `Option` as input, and ones that take a function as input (to be lazily evaluated).

The `and`, `or`, and `xor` methods take another `Option` as input, and produce an `Option` as output. Only the and method can produce an `Option<U>` value having a different inner type `U` than `Option<T>`.

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

The `and_then` and `or_else` methods take a function as input, and only evaluate the function when they need to produce a new value. Only the `and_then` method can produce an `Option<U>` value having a different inner type U than `Option<T>`.

| `method`   | function input | function result | output    |
| ---------- | -------------- | --------------- | --------- |
| `and_then` | (not provided) | (not evaluated) | `None`    |
| `and_then` | `x`            | `None`          | `None`    |
| `and_then` | `x`            | `Some(y)`       | `Some(y)` |
| `or_else`  | (not provided) | `None`          | `None`    |
| `or_else`  | (not provided) | `Some(y)`       | `Some(y)` |
| `or_else`  | (not provided) | (not evaluated) | `Some(x)` |

## Examples

...tbd

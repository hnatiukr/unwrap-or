// Copyright 2025 Roman Hnatiuk. All rights reserved. MIT license.

/**
 * # Module Option
 *
 * Optional values.
 *
 * ```rs
 * Option<T> {
 *     None,
 *     Some(T),
 * }
 * ```
 *
 * ## Overview
 *
 * Type `Option` represents an optional value: every `Option` is either `Some(T)`
 * and contains a value, or `None`, and does not. `Option` types are very common,
 * as they have a number of uses:
 *
 * - initial values
 * - return values for functions that are not defined over their entire input range
 *   (partial functions)
 * - return value for otherwise reporting simple errors, where `None` is returned
 *   on error
 * - optional struct fields
 * - struct fields that can be loaned or "taken"
 * - optional function arguments
 * - nullable pointers
 * - swapping things out of difficult situations
 *
 * Options are commonly paired with matching to query the presence of a value and
 * take action, always accounting for the `None` case.
 *
 * ```ts
 * function divide(numerator: number, denominator: number): Option<number> {
 *   return denominator === 0 ? Some(numerator / denominator) : None;
 * }
 *
 * let option_num: Option<number> = divide(2.0, 3.0);
 *
 * if (option_num.is_some()) {
 *   const value = option.unwrap();
 * }
 * ```
 *
 * ### Querying the variant
 *
 * The `is_some` and `is_none` methods return `true` if the `Option` is `Some` or
 * `None`, respectively.
 *
 * ### Extracting the contained value
 *
 * These methods extract the contained value in an `Option<T>` when it is the
 * `Some` variant. If the `Option` is `None`:
 *
 * - `expect` panics with a provided custom message
 * - `unwrap` panics with a generic message
 * - `unwrap_or` returns the provided default value
 * - `unwrap_or_else` returns the result of evaluating the provided function
 *
 * ### Transforming contained values
 *
 * - `ok_or` transforms `Some(v)` to `Ok(v)`, and `None` to `Err(err)` using the
 *   provided default `err` value
 * - `ok_or_else` transforms `Some(v)` to `Ok(v)`, and `None` to a value of `Err`
 *   using the provided function
 * - transpose transposes an `Option` of a `Result` into a `Result` of an `Option`
 *
 * These methods transform the `Some` variant:
 *
 * - `filter` calls the provided predicate function on the contained value `t` if
 *   the `Option` is `Some(t)`, and returns `Some(t)` if the function returns
 *   `true`; otherwise, returns `None`
 * - `flatten` removes one level of nesting from an `Option<Option<T>>`
 * - `map` transforms `Option<T>` to `Option<U>` by applying the provided function
 *   to the contained value of `Some` and leaving `None` values unchanged
 *
 * These methods transform `Option<T>` to a value of a possibly different type `U`:
 *
 * - `map_or` applies the provided function to the contained value of `Some`, or
 *   returns the provided default value if the `Option` is `None`
 * - `map_or_else` applies the provided function to the contained value of `Some`,
 *   or returns the result of evaluating the provided fallback function if the
 *   `Option` is `None`
 *
 * ### Boolean operators
 *
 * These methods treat the `Option` as a boolean value, where `Some` acts like
 * `true` and `None` acts like `false`. There are two categories of these methods:
 * ones that take an `Option` as input, and ones that take a function as input (to
 * be lazily evaluated).
 *
 * The `and`, `or`, and `xor` methods take another `Option` as input, and produce
 * an `Option` as output. Only the and method can produce an `Option<U>` value
 * having a different inner type `U` than `Option<T>`.
 *
 * | method | input     | output    |
 * | ------ | --------- | --------- |
 * | `and`  | (ignored) | `None`    |
 * | `and`  | `None`    | `None`    |
 * | `and`  | `Some(y)` | `Some(y)` |
 * | `or`   | `None`    | `None`    |
 * | `or`   | `Some(y)` | `Some(y)` |
 * | `or`   | (ignored) | `Some(x)` |
 * | `xor`  | `None`    | `None`    |
 * | `xor`  | `Some(y)` | `Some(y)` |
 * | `xor`  | `None`    | `Some(x)` |
 * | `xor`  | `Some(y)` | `None`    |
 *
 * The `and_then` and `or_else` methods take a function as input, and only evaluate
 * the function when they need to produce a new value. Only the `and_then` method
 * can produce an `Option<U>` value having a different inner type U than
 * `Option<T>`.
 *
 * | `method`   | function input | function result | output    |
 * | ---------- | -------------- | --------------- | --------- |
 * | `and_then` | (not provided) | (not evaluated) | `None`    |
 * | `and_then` | `x`            | `None`          | `None`    |
 * | `and_then` | `x`            | `Some(y)`       | `Some(y)` |
 * | `or_else`  | (not provided) | `None`          | `None`    |
 * | `or_else`  | (not provided) | `Some(y)`       | `Some(y)` |
 * | `or_else`  | (not provided) | (not evaluated) | `Some(x)` |
 *
 * ## Variants
 *
 * ### Some
 *
 * ```ts
 * Some<T>;
 * ```
 *
 * Some value of type `T`.
 *
 * ##### Examples
 *
 * ```ts
 * let x: Option<number> = Some(42);
 * ```
 *
 * ### None
 *
 * ```ts
 * None;
 * ```
 *
 * No value.
 *
 * ##### Examples
 *
 * ```ts
 * let x: Option<number> = None;
 * ```
 *
 * ## Import
 *
 * ```ts
 * import { None, type Option, Some } from "unwrap-or/option";
 * ```
 *
 * @module Option
 */

import { Err, Ok, type Result } from "../result/result.ts";

/**
 * Type `Option` represents an optional value:
 * every `Option` is either `Some` and contains a value,
 * or `None`, and does not.
 *
 * ### Example
 *
 * ```rs
 * let x: Option<number>
 *
 * x = Some(2)
 * assert_eq!(x, Some(2))
 *
 * x = None
 * assert_eq!(x, None)
 * ```
 *
 * @since 0.1.0-alpha
 */
export interface Option<T> {
  /**
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * Arguments passed to and are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `and_then`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   * let y: Option<string>
   *
   * x = Some(2)
   * y = None
   * assert_eq!(x.and(y), None)
   *
   * x = None
   * y = Some("foo")
   * assert_eq!(x.and(y), None)
   *
   * x = Some(2)
   * y = Some("foo")
   * assert_eq!(x.and(y), Some("foo"))
   *
   * x = None
   * y = None
   * assert_eq!(x.and(y), None)
   * ```
   *
   * @since 0.1.0-alpha
   */
  and<U>(optb: Option<U>): Option<T | U>;

  /**
   * Returns `None` if the option is `None`,
   * otherwise calls function `f` with the wrapped value and returns the result.
   *
   * Often used to chain fallible operations that may return `None`.
   *
   * Some languages call this operation `flatmap`.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<string>
   * let y: Option<string>
   *
   * x = Some("some value")
   * y = None
   * assert_eq!(
   *   x.and_then(() => y),
   *   None,
   * )
   *
   * x = None
   * y = Some("then value")
   * assert_eq!(
   *   x.and_then(() => y),
   *   None,
   * )
   *
   * x = Some("some value")
   * y = Some("then value")
   * assert_eq!(
   *   x.and_then(() => y),
   *   Some("then value"),
   * )
   *
   * x = None
   * y = None
   * assert_eq!(
   *   x.and_then(() => y),
   *   None,
   * )
   * ```
   *
   * @since 0.1.0-alpha
   */
  and_then<U>(f: (value: T) => Option<U>): Option<T | U>;

  /**
   * Returns the contained `Some` value.
   *
   * Recommend that expect messages are used to describe
   * the reason you expect the `Option` should be `Some`.
   *
   * @throws Throws an error if the value is a `None`
   * with a custom message provided by `msg`.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<string>;
   *
   * x = Some("value");
   * assert_eq!(x.expect("should return string value"), "value");
   *
   * x = None;
   * assert_err!(
   *   () => x.expect("should return string value"),
   *   Error,
   *   "should return string value",
   * );
   * ```
   *
   * @since 0.1.0-alpha
   */
  expect(msg: string): T;

  /**
   * Returns `None` if the option is `None`,
   * otherwise calls predicate with the wrapped value and returns:
   *
   * - `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
   * - `None` if predicate returns `false`
   *
   * ### Example
   *
   * ```rs
   * function is_even(n: number): boolean {
   *   return n % 2 == 0
   * }
   *
   * assert_eq!(None.filter(is_even), None)
   * assert_eq!(Some(3).filter(is_even), None)
   * assert_eq!(Some(4).filter(is_even), Some(4))
   * ```
   *
   * @since 0.1.0-alpha
   */
  filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * Flattening only removes one level of nesting at a time.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<Option<number>>;
   *
   * x = Some(Some(6));
   * assert_eq!(x.flatten(), Some(6));
   *
   *   x = Some(None);
   * assert_eq!(x.flatten(), None);
   *
   * x = None;
   * assert_eq!(x.flatten(), None);
   * ```
   *
   * @since 0.3.0-alpha
   */
  flatten<U>(this: Option<Option<U>>): Option<U>;

  /**
   * Calls a function with a reference to the contained value if `Some`.
   *
   * Returns the original option.
   *
   * ### Example
   *
   * ```rs
   * function get<T>(arr: T[], idx: number): Option<T> {
   *   const item = arr.at(idx);
   *   return item !== undefined ? Some(item) : None;
   * }
   *
   * const list = [1, 2, 3, 4, 5];
   *
   * let has_inspected = false;
   *
   * let x = get(list, 2).inspect((_v) => {
   *   has_inspected = true;
   * });
   *
   * assert_eq!(x, Some(3));
   * assert_eq!(has_inspected, true);
   * ```
   *
   * @since 0.1.0-alpha
   */
  inspect(f: (value: T) => void): Option<T>;

  /**
   * Returns `true` if the option is a `None` value.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   *
   * x = Some(2)
   * assert_eq!(x.is_none(), false)
   *
   * x = None
   * assert_eq!(x.is_none(), true)
   * ```
   *
   * @since 0.1.0-alpha
   */
  is_none(): boolean;

  /**
   * Returns `true` if the option is a `None`
   * or the value inside of it matches a predicate.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   *
   * x = Some(2)
   * assert_eq!(x.is_none_or((v) => v > 1), true)
   *
   * x = Some(0)
   * assert_eq!(x.is_none_or((v) => v > 1), false)
   *
   * x = None
   * assert_eq!(x.is_none_or((v) => v > 1), true)
   * ```
   *
   * @since 0.1.0-alpha
   */
  is_none_or(f: (value: T) => boolean): boolean;

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   *
   * x = Some(2)
   * assert_eq!(x.is_some(), true)
   *
   * x = None
   * assert_eq!(x.is_some(), false)
   * ```
   *
   * @since 0.1.0-alpha
   */
  is_some(): boolean;

  /**
   * Checks if the `Option` is `Some` and the value satisfies a predicate.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   *
   * x = Some(2)
   * assert_eq!(x.is_some_and((v) => v > 1), true)
   *
   * x = Some(0)
   * assert_eq!(x.is_some_and((v) => v > 1), false)
   *
   * x = None
   * assert_eq!(x.is_some_and((v) => v > 1), false)
   * ```
   *
   * @since 0.1.0-alpha
   */
  is_some_and(f: (value: T) => boolean): boolean;

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function `f`
   * to a contained value (if `Some`) or returns `None` (if `None`).
   *
   * ### Example
   *
   * ```rs
   * let x: Option<string>
   *
   * x = Some("Hello, World!")
   * assert_eq!(x.map((s) => s.length), Some(13))
   *
   * x = None
   * assert_eq!(x.map((s) => s.length), None)
   * ```
   *
   * @since 0.1.0-alpha
   */
  map<U>(f: (value: T) => U): Option<T | U>;

  /**
   * Returns the provided default result (if none),
   * or applies a function `f` to the contained value (if any).
   *
   * If you are passing the result of a function call,
   * it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<string>
   *
   * x = Some("foo")
   * assert_eq!(x.map_or(42, (v) => v.length), 3)
   *
   * x = None
   * assert_eq!(x.map_or(42, (v) => v.length), 42)
   * ```
   *
   * @since 0.1.0-alpha
   */
  map_or<U>(default_value: U, f: (value: T) => U): U;

  /**
   * Computes a default function result (if none),
   * or applies a different function to the contained value (if any).
   *
   * ### Example
   *
   * ```rs
   * const k = 21
   * let x: Option<string>
   *
   * x = Some("foo")
   * assert_eq!(x.map_or_else(() => 2 * k, (v) => v.length), 3)
   *
   * x = None
   * assert_eq!(x.map_or_else(() => 2 * k, (v) => v.length), 42)
   * ```
   *
   * @since 0.1.0-alpha
   */
  map_or_else<U>(default_f: () => U, f: (value: T) => U): U;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`,
   * mapping `Some(value)` to `Ok(value)` and `None` to `Err(err)`.
   *
   * Arguments passed to `ok_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use` ok_or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   * let y: Result<number, string>
   *
   * x = Some(42)
   * y = x.ok_or("Not found")
   * assert_eq!(y, Ok(42))
   *
   * x = None
   * y = x.ok_or("Not found")
   * assert_eq!(y, Err("Not found"))
   * ```
   *
   * @since 0.2.0-beta
   */
  ok_or<E>(err: E): Result<T, E>;

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * Arguments passed to or are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   * let y: Option<number>
   *
   * x = Some(2)
   * y = None
   * assert_eq!(x.or(y), Some(2))
   *
   * x = None
   * y = Some(100)
   * assert_eq!(x.or(y), Some(100))
   *
   * x = Some(2)
   * y = Some(100)
   * assert_eq!(x.or(y), Some(2))
   *
   * x = None
   * y = None
   * assert_eq!(x.or(y), None)
   * ```
   *
   * @since 0.1.0-alpha
   */
  or(optb: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value,
   * otherwise calls `f` and returns the result.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<string>
   * let y: Option<string>
   *
   * x = Some("barbarians")
   * y = Some("vikings")
   * assert_eq!(
   *   x.or_else(() => y),
   *   Some("barbarians"),
   * )
   *
   * x = None
   * y = Some("vikings")
   * assert_eq!(
   *   x.or_else(() => y),
   *   Some("vikings"),
   * )
   *
   * x = None
   * y = None
   * assert_eq!(
   *   x.or_else(() => y),
   *   None,
   * )
   * ```
   *
   * @since 0.1.0-alpha
   */
  or_else(f: () => Option<T>): Option<T>;

  /**
   * @ignore
   *
   * Returns a string representing this object.
   * This method is meant to be overridden by derived JS objects
   * for custom type coercion logic.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<unknown>
   *
   * x = Some(true)
   * assert_eq!(x.toString(), "Some(true)")
   *
   * x = Some(42)
   * assert_eq!(x.toString(), "Some(42)")
   *
   * x = Some("hello")
   * assert_eq!(x.toString(), "Some(hello)")
   *
   * x = Some([1, 2])
   * assert_eq!(x.toString(), "Some(1,2)")
   *
   * x = Some({})
   * assert_eq!(x.toString(), "Some([object Object])")
   *
   * x = Some(() => 2 * 4)
   * assert_eq!(x.toString(), "Some(() => 2 * 4)")
   *
   * x = None
   * assert_eq!(x.toString(), "None")
   * ```
   *
   * @since 0.1.0-alpha
   */
  toString(): string;

  // TODO: transpose(): Result<Option<T>, E>

  /**
   * Returns the contained `Some` value. Panics if it is `None`.
   *
   * Because this function may throw a TypeError, its use is generally discouraged.
   * Errors are meant for unrecoverable errors, and do abort the entire program.
   *
   * Instead, prefer to use try/catch, promise or pattern matching
   * and handle the `None` case explicitly, or call `unwrap_or` or `unwrap_or_else`.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<string>;
   *
   * x = Some("air");
   * assert_eq!(x.unwrap(), "air");
   *
   * x = None;
   * assert_err!(
   *   () => x.unwrap(),
   *   TypeError,
   *   "Called Option.unwrap() on a None value",
   * );
   * ```
   *
   * @since 0.1.0-alpha
   */
  unwrap(): T;

  /**
   * Returns the contained `Some` value or a provided default value.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   *
   * x = Some(42)
   * assert_eq!(x.unwrap_or(1), 42)
   *
   * x = None
   * assert_eq!(x.unwrap_or(1), 1)
   * ```
   *
   * @since 0.1.0-alpha
   */
  unwrap_or(default_value: T): T;

  /**
   * Returns the contained `Some` value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * ### Example
   *
   * ```rs
   * const k = 10
   * let x: Option<number>
   *
   * x = Some(4)
   * assert_eq!(x.unwrap_or_else(() => 2 * k), 4)
   *
   * x = None
   * assert_eq!(x.unwrap_or_else(() => 2 * k), 20)
   * ```
   *
   * @since 0.1.0-alpha
   */
  unwrap_or_else(f: () => T): T;

  /**
   * Returns `Some` if exactly one of itself, `optb` is `Some`,
   * otherwise returns `None`.
   *
   * ### Example
   *
   * ```rs
   * let x: Option<number>
   * let y: Option<number>
   *
   * x = Some(2)
   * y = None
   * assert_eq!(x.xor(y), Some(2))
   *
   * x = None
   * y = Some(100)
   * assert_eq!(x.xor(y), Some(100))
   *
   * x = Some(2)
   * y = Some(100)
   * assert_eq!(x.xor(y), None)
   *
   * x = None
   * y = None
   * assert_eq!(x.xor(y), None)
   * ```
   *
   * @since 0.1.0-alpha
   */
  xor(optb: Option<T>): Option<T>;
}

/**
 * @internal
 *
 * Unique id for Some
 */
const sid = Symbol.for("@@option/some");

/**
 * @internal
 *
 * Unique id for Some
 */
const nid = Symbol.for("@@option/none");

/**
 * @internal
 * @inheritdoc
 *
 * Option constructor
 */
class OptionConstructor<T> implements Option<T> {
  /**
   * @internal
   * @private
   */
  private _extract(): T {
    if (this.is_none()) {
      throw new TypeError("Prevent taking value from `None`.");
    }

    return (this as any)[sid] as T;
  }

  public constructor(_id: typeof nid);
  public constructor(_id: typeof sid, value: T);
  public constructor(_id: typeof sid | typeof nid, value?: T) {
    if (_id === sid) {
      (this as any)[_id] = value;
    } else if (_id === nid) {
      (this as any)[_id] = undefined;
    } else {
      throw new TypeError("Unknown constructor id");
    }
  }

  /** @inheritdoc */
  public and<U>(optb: Option<U>): Option<T | U> {
    if (this.is_some()) {
      return optb;
    }

    return new OptionConstructor<T>(nid);
  }

  /** @inheritdoc */
  public and_then<U>(f: (value: T) => Option<U>): Option<T | U> {
    if (this.is_some()) {
      return f(this._extract());
    }

    return new OptionConstructor<T>(nid);
  }

  /** @inheritdoc */
  public expect(msg: string): T {
    if (this.is_some()) {
      return this._extract();
    }

    throw new Error(msg);
  }

  /** @inheritdoc */
  public filter(predicate: (value: T) => boolean): Option<T> {
    if (this.is_some() && predicate(this._extract())) {
      return new OptionConstructor<T>(sid, this._extract());
    }

    return new OptionConstructor<T>(nid);
  }

  /** @inheritdoc */
  public flatten<U>(this: Option<Option<U>>): Option<U> {
    if (this.is_some()) {
      return (this as any)._extract();
    }

    return new OptionConstructor<U>(nid);
  }

  /** @inheritdoc */
  public inspect(f: (value: T) => void): Option<T> {
    if (this.is_some()) {
      f(this._extract());
    }

    return this;
  }

  /** @inheritdoc */
  public is_none(): boolean {
    return nid in this;
  }

  /** @inheritdoc */
  public is_none_or(f: (value: T) => boolean): boolean {
    if (this.is_some()) {
      return f(this._extract());
    }

    return true;
  }

  /** @inheritdoc */
  public is_some(): boolean {
    return sid in this;
  }

  /** @inheritdoc */
  public is_some_and(f: (value: T) => boolean): boolean {
    if (this.is_some()) {
      return f(this._extract());
    }

    return false;
  }

  /** @inheritdoc */
  public map<U>(f: (value: T) => U): Option<T | U> {
    if (this.is_some()) {
      return new OptionConstructor<U>(sid, f(this._extract()));
    }

    return new OptionConstructor<T>(nid);
  }

  /** @inheritdoc */
  public map_or<U>(default_value: U, f: (value: T) => U): U {
    if (this.is_some()) {
      return f(this._extract());
    }

    return default_value;
  }

  /** @inheritdoc */
  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    if (this.is_some()) {
      return f(this._extract());
    }

    return default_f();
  }

  /** @inheritdoc */
  public ok_or<E>(err: E): Result<T, E> {
    let result: Result<T, E>;

    if (this.is_some()) {
      result = Ok(this._extract());
    } else {
      result = Err(err);
    }

    return result;
  }

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  /** @inheritdoc */
  public or(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return new OptionConstructor<T>(sid, this._extract());
    }

    return optb;
  }

  /** @inheritdoc */
  public or_else(f: () => Option<T>): Option<T> {
    if (this.is_some()) {
      return new OptionConstructor<T>(sid, this._extract());
    }

    return f();
  }

  /** @inheritdoc */
  public toString(): string {
    return this.is_some() ? `Some(${this._extract()})` : "None";
  }

  /**
   * Overrides Node.js object inspection.
   *
   * @see toString
   *
   * @ignore
   */
  public [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.toString();
  }

  // TODO: transpose(): Result<Option<T>, E>

  /** @inheritdoc */
  public unwrap(): T {
    if (this.is_some()) {
      return this._extract();
    }

    throw new TypeError("Called Option.unwrap() on a None value");
  }

  /** @inheritdoc */
  public unwrap_or(default_value: T): T {
    if (this.is_some()) {
      return this._extract();
    }

    return default_value;
  }

  /** @inheritdoc */
  public unwrap_or_else(f: () => T): T {
    if (this.is_some()) {
      return this._extract();
    }

    return f();
  }

  /** @inheritdoc */
  public xor(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return optb.is_none()
        ? new OptionConstructor<T>(sid, this._extract())
        : new OptionConstructor<T>(nid);
    }

    return optb.is_some() ? optb : new OptionConstructor<T>(nid);
  }
}

/**
 * Some value of type T.
 *
 * ### Example
 *
 * ```rs
 * let x: Option<number> = Some(42)
 * ```
 *
 * @since 0.1.0-alpha
 */
export function Some<T>(value: T): Option<T> {
  return new OptionConstructor<T>(sid, value);
}

/**
 * No value.
 *
 * ### Example
 *
 * ```rs
 * let x: Option<number> = None
 * ```
 *
 * @since 0.1.0-alpha
 */
export const None: Option<any> = new OptionConstructor<any>(nid);

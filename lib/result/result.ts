// Copyright 2025 Roman Hnatiuk. All rights reserved. MIT license.

/**
 * # Module Result
 *
 * Error handling.
 *
 * ```ts
 * Result<T, E> {
 *    Ok(T),
 *    Err(E),
 * }
 * ```
 *
 * ## Overview
 *
 * Type `Result` is used for returning and propagating errors. There are variants,
 * `Ok(T)`, representing success and containing a value, and `Err(E)`, representing
 * error and containing an error value.
 *
 * Commonly, `Result` is most prominently used for I/O.
 *
 * ### Results must be used
 *
 * A common problem with using return values to indicate errors is that it is easy
 * to ignore the return value, thus failing to handle the error. `Result`
 * especially useful with functions that may encounter errors but don’t otherwise
 * return a useful value.
 *
 * ### Querying the variant
 *
 * The `is_ok` and `is_err` methods return `true` if the `Result` is `Ok` or `Err`,
 * respectively.
 *
 * The `is_ok_and` and `is_err_and` methods apply the provided function to the
 * contents of the `Result` to produce a boolean value. If the `Result` does not
 * have the expected variant then `false` is returned instead without executing the
 * function.
 *
 * ### Extracting contained values
 *
 * These methods extract the contained value in a `Result<T, E>` when it is the
 * `Ok` variant.
 *
 * If the `Result` is `Err`:
 *
 * - `expect` panics with a provided custom message
 * - `unwrap` panics with a generic message
 * - `unwrap_or` returns the provided default value
 * - `unwrap_or_else` returns the result of evaluating the provided function
 *
 * If the `Result` is `Ok`:
 *
 * - `expect_err` panics with a provided custom message
 * - `unwrap_err` panics with a generic message
 *
 * ### Transforming contained values
 *
 * These methods transform `Result` to `Option`:
 *
 * - `err` transforms `Result<T, E>` into `Option<E>`, mapping `Err(e)` to
 *   `Some(e)` and `Ok(v)` to `None`
 * - `ok` transforms `Result<T, E>` into `Option<T>`, mapping `Ok(v)` to `Some(v)`
 *   and `Err(e)` to `None`
 * - `transpose` transposes a `Result` of an `Option` into an `Option` of a
 *   `Result`
 *
 * These methods transform the contained value of the `Ok` variant:
 *
 * - `map` transforms `Result<T, E>` into `Result<U, E>` by applying the provided
 *   function to the contained value of `Ok` and leaving `Err` values unchanged
 * - `inspect` takes ownership of the `Result`, applies the provided function to
 *   the contained value by reference, and then returns the `Result`
 *
 * These methods transform the contained value of the `Err` variant:
 *
 * - `map_err` transforms `Result<T, E>` into `Result<T, F>` by applying the
 *   provided function to the contained value of `Err` and leaving `Ok` values
 *   unchanged
 * - `inspect_err` takes ownership of the `Result`, applies the provided function
 *   to the contained value of `Err` by reference, and then returns the `Result`
 *
 * These methods transform a `Result<T, E>` into a value of a possibly different
 * type `U`:
 *
 * - `map_or` applies the provided function to the contained value of `Ok`, or
 *   returns the provided default value if the `Result` is `Err`
 * - `map_or_else` applies the provided function to the contained value of `Ok`, or
 *   applies the provided default fallback function to the contained value of `Err`
 *
 * ### Boolean operators
 *
 * These methods treat the `Result` as a boolean value, where `Ok` acts like `true`
 * and `Err` acts like `false`. There are two categories of these methods: ones
 * that take a `Result` as input, and ones that take a function as input (to be
 * lazily evaluated).
 *
 * The `and` and `or` methods take another `Result` as input, and produce a
 * `Result` as output. The `and` method can produce a `Result<U, E>` value having a
 * different inner type `U` than `Result<T, E>`. The `or` method can produce a
 * `Result<T, F>` value having a different error type `F` than `Result<T, E>`.
 *
 * | method | input     | output   |
 * | ------ | --------- | -------- |
 * | `and`  | (ignored) | `Err(e)` |
 * | `and`  | `Err(d)`  | `Err(d)` |
 * | `and`  | `Ok(y)`   | `Ok(y)`  |
 * | `or`   | `Err(d)`  | `Err(d)` |
 * | `or`   | `Ok(y)`   | `Ok(y)`  |
 * | `or`   | (ignored) | `Ok(x)`  |
 *
 * The `and_then` and `or_else` methods take a function as input, and only evaluate
 * the function when they need to produce a new value. The `and_then` method can
 * produce a `Result<U, E>` value having a different inner type `U` than
 * `Result<T, E>`. The `or_else` method can produce a `Result<T, F>` value having a
 * different error type `F` than `Result<T, E>`.
 *
 * | method     | self     | function input | function result | output   |
 * | ---------- | -------- | -------------- | --------------- | -------- |
 * | `and_then` | `Err(e)` | (not provided) | (not evaluated) | `Err(e)` |
 * | `and_then` | `Ok(x)`  | `x`            | `Err(d)`        | `Err(d)` |
 * | `and_then` | `Ok(x)`  | `x`            | `Ok(y)`         | `Ok(y)`  |
 * | `or_else`  | `Err(e)` | `e`            | `Err(d)`        | `Err(d)` |
 * | `or_else`  | `Err(e)` | `e`            | `Ok(y)`         | `Ok(y)`  |
 * | `or_else`  | `Ok(x)`  | (not provided) | (not evaluated) | `Ok(x)`  |
 *
 * ## Variants
 *
 * ### Ok
 *
 * ```ts
 * Ok(T);
 * ```
 *
 * Contains the success value.
 *
 * #### Examples
 *
 * ```ts
 * let x: Result<number, string> = Ok(42);
 * ```
 *
 * ### Err
 *
 * ```ts
 * Err(E);
 * ```
 *
 * Contains the error value.
 *
 * #### Examples
 *
 * ```ts
 * let x: Result<number, string> = Err("Not found");
 * ```
 *
 * ## Import
 *
 * ```ts
 * import { Err, Ok, type Result } from "unwrap-or/result";
 * ```
 *
 * @module Result
 */

/**
 * Type `Result` is a type that represents either success `Ok(T)`
 * and containing a value, or `Err(E)`, representing error
 * and containing an error value.
 *
 * ### Example
 *
 * ```ts
 * let x: Result<number, string>
 *
 * x = Ok(42)
 * assert_eq!(x, Ok(42))
 *
 * x = Err('empty')
 * assert_eq!(x, Err('empty'))
 * ```
 *
 * @since 0.4.0-alpha
 */
export interface Result<T, E> {
  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * Arguments passed to and are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `and_then`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   * let y: Result<string, string>
   *
   * x = Ok(2)
   * y = Err("late error")
   * assert_eq!(x.and(y), Err("late error"))
   *
   * x = Err("early error")
   * y = Ok("foo")
   * assert_eq!(x.and(y), Err("early error"))
   *
   * x = Err("not a 2")
   * y = Err("late error")
   * assert_eq!(x.and(y), Err("not a 2"))
   *
   * x = Ok(2)
   * y = Ok("different result type")
   * assert_eq!(x.and(y), Ok("different result type"))
   * ```
   *
   * @since 0.4.0-alpha
   */
  and<U>(res: Result<U, E>): Result<T | U, E>;

  /**
   * Calls `op` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * Often used to chain fallible operations that may return `Err`.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>;
   * let y: Result<string, string>;
   *
   * x = Ok(2)
   * y = Err("late error")
   * assert_eq!(
   *   x.and_then(() => y),
   *   Err("late error"),
   * )
   *
   * x = Err("early error")
   * y = Ok("foo")
   * assert_eq!(
   *   x.and_then(() => y),
   *   Err("early error"),
   * )
   *
   * x = Err("not a 2")
   * y = Err("late error")
   * assert_eq!(
   *   x.and_then(() => y),
   *   Err("not a 2"),
   * )
   *
   * x = Ok(2)
   * y = Ok("different result type")
   * assert_eq!(
   *   x.and_then(() => y),
   *   Ok("different result type"),
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  and_then<U>(op: (value: T) => Result<U, E>): Result<T | U, E>;

  // TODO: public err() {}

  /**
   * Returns the contained `Ok` value.
   *
   * Because this method may throw, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the `Err` case explicitly,
   * or call `unwrap_or`, `unwrap_or_else`, or `unwrap_or_default`.
   *
   * Recommend that expect messages are used to describe the reason
   * you expect the `Result` should be `Ok`.
   *
   * Panics if the value is an `Err`,
   * with a panic message including the passed message, and the value of the `Err`.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.expect("should return 42"), 42)
   *
   * x = Err("unknown value")
   * assert_err!(
   *   () => x.expect("should return 42"),
   *   'should return 42: "unknown value"',
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  expect(msg: string): T;

  /**
   * Returns the contained `Err` value.
   *
   * Panics if the value is an `Ok`, with a panic message
   * including the passed message, and the content of the Ok.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_err!(
   *   () => x.expect_err("should return unknown error value"),
   *   "should return unknown error value: 42",
   * )
   *
   * x = Err("unknown error value")
   * assert_eq!(
   *   x.expect_err("should return unknown error value"),
   *   "unknown error value",
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  expect_err(msg: string): E;

  // TODO: public flatten() {}

  /**
   * Calls a function with a reference to the contained value if `Ok`.
   *
   * Returns the original result.
   *
   * ### Example
   *
   * ```ts
   * function get<T>(arr: T[], idx: number): Result<T, string> {
   *   const item = arr.at(idx)
   *   return item !== undefined ? Ok(item) : Err("Not found")
   * }
   *
   * const list = [1, 2, 3, 4, 5]
   *
   * let has_inspected = false
   *
   * let x = get(list, 2).inspect((_v) => {
   *   has_inspected = true
   * })
   *
   * assert_eq!(x, Ok(3))
   * assert_eq!(has_inspected, true)
   * ```
   *
   * @since 0.4.0-alpha
   */
  inspect(f: (value: T) => void): Result<T, E>;

  /**
   * Calls a function with a reference to the contained value if `Err`.
   *
   * Returns the original result.
   *
   * ### Example
   *
   * ```ts
   * function get<T>(arr: T[], idx: number): Result<T, string> {
   *   const item = arr.at(idx)
   *
   *   return item !== undefined ? Ok(item) : Err("Not found")
   * }
   *
   * const list = [1, 2, 3, 4, 5]
   *
   * let has_inspected = false
   *
   * let x = get(list, 9).inspect_err((_e) => {
   *   has_inspected = true
   * })
   *
   * assert_eq!(x, Err("Not found"))
   * assert_eq!(has_inspected, true)
   * ```
   *
   * @since 0.4.0-alpha
   */
  inspect_err(f: (err: E) => void): Result<T, E>;

  /**
   * Returns `true` if the result is `Err`.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.is_err(), false)
   *
   * x = Err("Not found")
   * assert_eq!(x.is_err(), true)
   * ```
   *
   * @since 0.4.0-alpha
   */
  is_err(): boolean;

  /**
   * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<{ html: string }, { statusCode: number }>
   *
   * x = Err({ statusCode: 500 })
   * assert_eq!(
   *  x.is_err_and((err) => err.statusCode === 404),
   *  false,
   * )
   *
   * x = Err({ statusCode: 404 })
   * assert_eq!(
   *  x.is_err_and((err) => err.statusCode === 404),
   *  true,
   * )
   *
   * x = Ok({ html: "value" })
   * assert_eq!(
   *  x.is_err_and((err) => err.statusCode === 404),
   *  false,
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  is_err_and(f: (err: E) => boolean): boolean;

  /**
   * Returns `true` if the result is `Ok`.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.is_ok(), true)
   *
   * x = Err("Not found")
   * assert_eq!(x.is_ok(), false)
   * ```
   *
   * @since 0.4.0-alpha
   */
  is_ok(): boolean;

  /**
   * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(0)
   * assert_eq!(
   *   x.is_ok_and((value) => value > 10),
   *   false,
   * )
   *
   * x = Ok(42)
   * assert_eq!(
   *   x.is_ok_and((value) => value > 10),
   *   true,
   * )
   *
   * x = Err("Not found")
   * assert_eq!(
   *   x.is_ok_and((value) => value > 10),
   *   false,
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  is_ok_and(f: (value: T) => boolean): boolean;

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function
   * to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<string, { statusCode: number }>
   *
   * x = Ok("42")
   * assert_eq!(
   *   x.map((value) => Number.parseInt(value, 10)),
   *   Ok(42),
   * )
   *
   * x = Err({ statusCode: 404 })
   * assert_eq!(
   *   x.map((value) => Number.parseInt(value, 10)),
   *   Err({ statusCode: 404 }),
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  map<U>(f: (value: T) => U): Result<T | U, E>;

  /**
   * Returns the provided default (if `Err`),
   * or applies a function to the contained value (if `Ok`).
   *
   * Arguments passed to `map_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<string, string>
   *
   * x = Ok("foo")
   * assert_eq!(
   *   x.map_or(42, (v) => v.length),
   *   3,
   * )
   *
   * x = Err("bar")
   * assert_eq!(
   *   x.map_or(42, (v) => v.length),
   *   42,
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  map_or<U>(default_value: U, f: (value: T) => U): U;

  /**
   * Maps a `Result<T, E>` to `U` by applying fallback function `default_f`
   * to a contained `Err` value, or function `f` to a contained `Ok` value.
   *
   * ### Example
   *
   * ```ts
   * const k = 21
   * let x: Result<string, string>
   *
   * x = Ok("foo")
   * assert_eq!(
   *   x.map_or_else(
   *     () => 2 * k,
   *     (v) => v.length,
   *   ),
   *   3,
   * )
   *
   * x = Err("bar")
   * assert_eq!(
   *   x.map_or_else(
   *     () => 2 * k,
   *     (v) => v.length,
   *   ),
   *   42,
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  map_or_else<U>(default_f: () => U, f: (value: T) => U): U;

  // TODO: public ok() {}

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * Arguments passed to or are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   * let y: Result<number, string>
   *
   * x = Ok(2)
   * y = Err("Not found")
   * assert_eq!(x.or(y), Ok(2))
   *
   * x = Err("Not found")
   * y = Ok(100)
   * assert_eq!(x.or(y), Ok(100))
   *
   * x = Ok(2)
   * y = Ok(100)
   * assert_eq!(x.or(y), Ok(2))
   *
   * x = Err("Not found")
   * y = Err("Not found")
   * assert_eq!(x.or(y), Err("Not found"))
   * ```
   *
   * @since 0.4.0-alpha
   */
  or(res: Result<T, E>): Result<T, E>;

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on result values.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<string, { statusCode: number }>
   * let y: Result<string, { statusCode: number }>
   *
   * x = Ok("barbarians")
   * y = Ok("vikings")
   * assert_eq!(
   *   x.or_else(() => y),
   *   Ok("barbarians"),
   * )
   *
   * x = Err({ statusCode: 404 })
   * y = Ok("vikings")
   * assert_eq!(
   *   x.or_else(() => y),
   *   Ok("vikings"),
   * )
   *
   * x = Err({ statusCode: 404 })
   * y = Err({ statusCode: 404 })
   * assert_eq!(
   *   x.or_else(() => y),
   *   Err({ statusCode: 404 }),
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  or_else(f: () => Result<T, E>): Result<T, E>;

  /**
   * @ignore
   *
   * Returns a string representing this object.
   * This method is meant to be overridden by derived JS objects
   * for custom type coercion logic.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<unknown, unknown>
   *
   * x = Ok(true)
   * assert_eq!(x.toString(), "Ok(true)")
   *
   * x = Ok(42)
   * assert_eq!(x.toString(), "Ok(42)")
   *
   * x = Ok("hello")
   * assert_eq!(x.toString(), "Ok(hello)")
   *
   * x = Ok([1, 2])
   * assert_eq!(x.toString(), "Ok(1,2)")
   *
   * x = Ok({})
   * assert_eq!(x.toString(), "Ok([object Object])")
   *
   * x = Ok(() => 2 * 4)
   * assert_eq!(x.toString(), "Ok(() => 2 * 4)")
   *
   * x = Err(true)
   * assert_eq!(x.toString(), "Err(true)")
   *
   * x = Err(42)
   * assert_eq!(x.toString(), "Err(42)")
   *
   * x = Err("hello")
   * assert_eq!(x.toString(), "Err(hello)")
   *
   * x = Err([1, 2])
   * assert_eq!(x.toString(), "Err(1,2)")
   *
   * x = Err({})
   * assert_eq!(x.toString(), "Err([object Object])")
   *
   * x = Err(() => 2 * 4)
   * assert_eq!(x.toString(), "Err(() => 2 * 4)")
   * ```
   *
   * @since 0.4.0-alpha
   */
  toString(): string;

  // TODO: public transpose() {}

  /**
   * Returns the contained `Ok` value.
   *
   * Because this function may throw, its use is generally discouraged.
   * Prefer to call inside `try/catch` statement, or handle the `Err` case explicitly,
   * or call `unwrap_or`, `unwrap_or_else`, or `unwrap_or_default`.
   *
   * Panics if the value is an `Err`, with a message provided by the `Err`’s value.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.unwrap(), 42)
   *
   * x = Err("Not found")
   * assert_err!(
   *   () => x.unwrap(),
   *   TypeError,
   *   "Called Result.unwrap() on an Err(E) value",
   * )
   * ```
   *
   * @since 0.4.0-alpha
   */
  unwrap(): T;

  /**
   * Returns the contained `Err` value.
   *
   * Panics if the value is an `Ok`, with a custom panic message provided by the `Ok`’s value.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_err!(
   *   () => x.unwrap_err(),
   *   TypeError,
   *   "Called Result.unwrap_err() on an Ok value",
   * )
   *
   * x = Err("Not found")
   * assert_eq!(x.unwrap_err(), "Not found")
   * ```
   *
   * @since 0.4.0-alpha
   */
  unwrap_err(): E;

  /**
   * Returns the contained `Ok` value or a provided default.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>;
   *
   * x = Ok(42);
   * assert_eq!(x.unwrap_or(0), 42);
   *
   * x = Err("Not found");
   * assert_eq!(x.unwrap_or(0), 0);
   * ```
   *
   * @since 0.4.0-alpha
   */
  unwrap_or(default_value: T): T;

  /**
   * Returns the contained `Ok` value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * ### Example
   *
   * ```ts
   * let x: Result<number, string>;
   *
   * x = Ok(42);
   * assert_eq!(
   *   x.unwrap_or_else((err) => err.length),
   *   42,
   * );
   *
   * x = Err("foo");
   * assert_eq!(
   *   x.unwrap_or_else((err) => err.length),
   *   3,
   * );
   * ```
   *
   * @since 0.4.0-alpha
   */
  unwrap_or_else(f: (err: E) => T): T;
}

/**
 * @internal
 *
 * Unique id for Ok
 */
const oid = Symbol.for("@@result/ok");

/**
 * @internal
 *
 * Unique id for Err
 */
const eid = Symbol.for("@@result/err");

/**
 * @internal
 *
 * Result constructor
 */
class ResultConstructor<T, E> implements Result<T, E> {
  /**
   * @internal
   * @private
   */
  private _extract(): T {
    if (this.is_err()) {
      throw new TypeError("Prevent taking value from `Err(E)`.");
    }

    return (this as any)[oid] as T;
  }

  /**
   * @internal
   * @private
   */
  private _extract_err(): E {
    if (this.is_ok()) {
      throw new TypeError("Prevent taking err from `Ok(T)`.");
    }

    return (this as any)[eid] as E;
  }

  /**
   * @internal
   * @private
   */
  public constructor(_id: typeof oid, value: T);
  public constructor(_id: typeof eid, err: E);
  public constructor(_id: typeof oid | typeof eid, value?: T | E) {
    (this as any)[_id] = value;
  }

  /** @inheritdoc */
  public and<U>(res: Result<U, E>): Result<T | U, E> {
    if (this.is_ok()) {
      return res;
    }

    return new ResultConstructor<T, E>(eid, this._extract_err());
  }

  /** @inheritdoc */
  public and_then<U>(op: (value: T) => Result<U, E>): Result<T | U, E> {
    if (this.is_ok()) {
      return op(this._extract());
    }

    return new ResultConstructor<T, E>(eid, this._extract_err());
  }

  // TODO: public err() {}

  /** @inheritdoc */
  public expect(msg: string): T {
    if (this.is_ok()) {
      return this._extract();
    }

    const err = this._extract_err();
    const str_err = JSON.stringify(err);

    throw new Error(`${msg}: ${str_err}`);
  }

  /** @inheritdoc */
  public expect_err(msg: string): E {
    if (this.is_err()) {
      return this._extract_err();
    }

    const value = this._extract();
    const str_value = JSON.stringify(value);

    throw new Error(`${msg}: ${str_value}`);
  }

  // TODO: public flatten() {}

  /** @inheritdoc */
  public inspect(f: (value: T) => void): Result<T, E> {
    if (this.is_ok()) {
      f(this._extract());
    }

    return this;
  }

  /** @inheritdoc */
  public inspect_err(f: (err: E) => void): Result<T, E> {
    if (this.is_err()) {
      f(this._extract_err());
    }

    return this;
  }

  /** @inheritdoc */
  public is_err(): boolean {
    return eid in this;
  }

  /** @inheritdoc */
  public is_err_and(f: (err: E) => boolean): boolean {
    if (this.is_err()) {
      return f(this._extract_err());
    }

    return false;
  }

  /** @inheritdoc */
  public is_ok(): boolean {
    return oid in this;
  }

  /** @inheritdoc */
  public is_ok_and(f: (value: T) => boolean): boolean {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return false;
  }

  /** @inheritdoc */
  public map<U>(f: (value: T) => U): Result<T | U, E> {
    if (this.is_ok()) {
      return new ResultConstructor<U, E>(oid, f(this._extract()));
    }

    return new ResultConstructor<T, E>(eid, this._extract_err());
  }

  /** @inheritdoc */
  public map_or<U>(default_value: U, f: (value: T) => U): U {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return default_value;
  }

  /** @inheritdoc */
  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return default_f();
  }

  // TODO: public ok() {}

  /** @inheritdoc */
  public or(res: Result<T, E>): Result<T, E> {
    if (this.is_ok()) {
      return new ResultConstructor<T, E>(oid, this._extract());
    }

    return res;
  }

  /** @inheritdoc */
  public or_else(f: () => Result<T, E>): Result<T, E> {
    if (this.is_ok()) {
      return new ResultConstructor<T, E>(oid, this._extract());
    }

    return f();
  }

  /** @inheritdoc */
  public toString(): string {
    if (this.is_ok()) {
      return `Ok(${this._extract()})`;
    }

    return `Err(${this._extract_err()})`;
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

  // TODO: public transpose() {}

  /** @inheritdoc */
  public unwrap(): T {
    if (this.is_ok()) {
      return this._extract();
    }

    throw new TypeError("Called Result.unwrap() on an Err value");
  }

  /** @inheritdoc */
  public unwrap_err(): E {
    if (this.is_err()) {
      return this._extract_err();
    }

    throw new TypeError("Called Result.unwrap_err() on an Ok value");
  }

  /** @inheritdoc */
  public unwrap_or(default_value: T): T {
    if (this.is_ok()) {
      return this._extract();
    }

    return default_value;
  }

  /** @inheritdoc */
  public unwrap_or_else(f: (err: E) => T): T {
    if (this.is_ok()) {
      return this._extract();
    }

    return f(this._extract_err());
  }
}

/**
 * Contains the success value.
 *
 * ### Example
 *
 * ```ts
 * let x: Result<number, string> = Ok(42)
 * ```
 *
 * @since 0.4.0-alpha
 */
export function Ok<T>(value: T): Result<T, any> {
  return new ResultConstructor<T, any>(oid, value);
}

/**
 * Contains the error value.
 *
 * ### Example
 *
 * ```ts
 * let x: Result<number, string> = Err("Not found")
 * ```
 *
 * @since 0.4.0-alphag
 */
export function Err<E>(err: E): Result<any, E> {
  return new ResultConstructor<any, E>(eid, err);
}

/**
 * @module Option
 */

import type { Result } from "../result/index.ts";

/**
 * @since 0.1.0-alpha
 *
 * Type `Option` represents an optional value:
 * every `Option` is either `Some` and contains a value,
 * or `None`, and does not.
 *
 * @example
 *
 * let x: Option<number>
 *
 * x = Some(2)
 * assert_eq!(x, Some(2))
 *
 * x = None
 * assert_eq!(x, None)
 */
export interface Option<T> {
  /**
   * @since 0.1.0-alpha
   *
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * Arguments passed to and are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @example
   *
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
   */
  and<U>(optb: Option<U>): Option<T | U>;

  /**
   * @since 0.1.0-alpha
   *
   * Returns `None` if the option is `None`,
   * otherwise calls function `f` with the wrapped value and returns the result.
   *
   * Often used to chain fallible operations that may return `None`.
   *
   * Some languages call this operation `flatmap`.
   *
   * @example
   *
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
   */
  and_then<U>(f: (value: T) => Option<U>): Option<T | U>;

  /**
   * @since 0.1.0-alpha
   *
   * Returns the contained `Some` value.
   *
   * Recommend that expect messages are used to describe
   * the reason you expect the `Option` should be `Some`.
   *
   * @throws Throws an error if the value is a `None`
   * with a custom message provided by `msg`.
   *
   * @example
   *
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
   */
  expect(msg: string): T;

  /**
   * @since 0.1.0-alpha
   *
   * Returns `None` if the option is `None`,
   * otherwise calls predicate with the wrapped value and returns:
   *
   * - `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
   * - `None` if predicate returns `false`
   *
   * @example
   *
   * function is_even(n: number): boolean {
   *   return n % 2 == 0
   * }
   *
   * assert_eq!(None.filter(is_even), None)
   * assert_eq!(Some(3).filter(is_even), None)
   * assert_eq!(Some(4).filter(is_even), Some(4))
   */
  filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * @since 0.3.0-alpha
   *
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * Flattening only removes one level of nesting at a time.
   *
   * @example
   *
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
   */
  flatten<U>(this: Option<Option<U>>): Option<U>;

  /**
   * @since 0.1.0-alpha
   *
   * Calls a function with a reference to the contained value if `Some`.
   *
   * Returns the original option.
   *
   * @example
   *
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
   */
  inspect(f: (value: T) => void): Option<T>;

  /**
   * @since 0.1.0-alpha
   *
   * Returns `true` if the option is a `None` value.
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(2)
   * assert_eq!(x.is_none(), false)
   *
   * x = None
   * assert_eq!(x.is_none(), true)
   */
  is_none(): boolean;

  /**
   * @since 0.1.0-alpha
   *
   * Returns `true` if the option is a `None`
   * or the value inside of it matches a predicate.
   *
   * @example
   *
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
   */
  is_none_or(f: (value: T) => boolean): boolean;

  /**
   * @since 0.1.0-alpha
   *
   * Returns `true` if the option is a `Some` value.
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(2)
   * assert_eq!(x.is_some(), true)
   *
   * x = None
   * assert_eq!(x.is_some(), false)
   */
  is_some(): boolean;

  /**
   * @since 0.1.0-alpha
   *
   * Checks if the `Option` is `Some` and the value satisfies a predicate.
   *
   * @example
   *
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
   */
  is_some_and(f: (value: T) => boolean): boolean;

  /**
   * @since 0.1.0-alpha
   *
   * Maps an `Option<T>` to `Option<U>` by applying a function `f`
   * to a contained value (if `Some`) or returns `None` (if `None`).
   *
   * @example
   *
   * let x: Option<string>
   *
   * x = Some("Hello, World!")
   * assert_eq!(x.map((s) => s.length), Some(13))
   *
   * x = None
   * assert_eq!(x.map((s) => s.length), None)
   */
  map<U>(f: (value: T) => U): Option<T | U>;

  /**
   * @since 0.1.0-alpha
   *
   * Returns the provided default result (if none),
   * or applies a function `f` to the contained value (if any).
   *
   * If you are passing the result of a function call,
   * it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @example
   *
   * let x: Option<string>
   *
   * x = Some("foo")
   * assert_eq!(x.map_or(42, (v) => v.length), 3)
   *
   * x = None
   * assert_eq!(x.map_or(42, (v) => v.length), 42)
   */
  map_or<U>(default_value: U, f: (value: T) => U): U;

  /**
   * @since 0.1.0-alpha
   *
   * Computes a default function result (if none),
   * or applies a different function to the contained value (if any).
   *
   * @example
   *
   * const k = 21
   * let x: Option<string>
   *
   * x = Some("foo")
   * assert_eq!(x.map_or_else(() => 2 * k, (v) => v.length), 3)
   *
   * x = None
   * assert_eq!(x.map_or_else(() => 2 * k, (v) => v.length), 42)
   */
  map_or_else<U>(default_f: () => U, f: (value: T) => U): U;

  /**
   * @since 0.2.0-beta
   *
   * Transforms the `Option<T>` into a `Result<T, E>`,
   * mapping `Some(value)` to `Ok(value)` and `None` to `Err(err)`.
   *
   * Arguments passed to `ok_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use` ok_or_else`, which is lazily evaluated.
   *
   * @example
   *
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
   */
  ok_or<E>(err: E): Result<T, E>;

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  /**
   * @since 0.1.0-alpha
   *
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * Arguments passed to or are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @example
   *
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
   */
  or(optb: Option<T>): Option<T>;

  /**
   * @since 0.1.0-alpha
   *
   * Returns the option if it contains a value,
   * otherwise calls `f` and returns the result.
   *
   * @example
   *
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
   */
  or_else(f: () => Option<T>): Option<T>;

  /**
   * @since 0.1.0-alpha
   *
   * @ignore
   *
   * Returns a string representing this object.
   * This method is meant to be overridden by derived JS objects
   * for custom type coercion logic.
   *
   * @example
   *
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
   */
  toString(): string;

  // TODO: transpose(): Result<Option<T>, E>

  /**
   * @since 0.1.0-alpha
   *
   * Returns the contained `Some` value. Panics if it is `None`.
   *
   * Because this function may throw a TypeError, its use is generally discouraged.
   * Errors are meant for unrecoverable errors, and do abort the entire program.
   *
   * Instead, prefer to use try/catch, promise or pattern matching
   * and handle the `None` case explicitly, or call `unwrap_or` or `unwrap_or_else`.
   *
   * @example
   *
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
   */
  unwrap(): T;

  /**
   * @since 0.1.0-alpha
   *
   * Returns the contained `Some` value or a provided default value.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(42)
   * assert_eq!(x.unwrap_or(1), 42)
   *
   * x = None
   * assert_eq!(x.unwrap_or(1), 1)
   */
  unwrap_or(default_value: T): T;

  /**
   * @since 0.1.0-alpha
   *
   * Returns the contained `Some` value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * @example
   *
   * const k = 10
   * let x: Option<number>
   *
   * x = Some(4)
   * assert_eq!(x.unwrap_or_else(() => 2 * k), 4)
   *
   * x = None
   * assert_eq!(x.unwrap_or_else(() => 2 * k), 20)
   */
  unwrap_or_else(f: () => T): T;

  /**
   * @since 0.1.0-alpha
   *
   * Returns `Some` if exactly one of itself, `optb` is `Some`,
   * otherwise returns `None`.
   *
   * @example
   *
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
   */
  xor(optb: Option<T>): Option<T>;
}

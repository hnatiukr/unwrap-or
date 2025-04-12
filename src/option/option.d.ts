/**
 * @module Option
 * @version 0.1.0-alpha
 * @author Roman Hnatiuk <hnatiukr@pm.me>
 * @see https://github.com/hnatiukr/unwrap-or
 * @license MIT
 *
 * It is a playground library that closely mirrors Rust's Option and Result API.
 * While created primarily for fun and learning, it's robust enough for real-world applications.
 * It allows for safer, more expressive handling of optional values through a monadic interface.
 *
 * Use it to:
 *
 * - eliminate null checks
 * - make optional logic explicit
 * - chain transformations on values that might not exist
 * - handle errors gracefully
 */

/**
 * Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.
 *
 * @since 1.0.0
 *
 * @param T
 * @type {(Some<T>|None)}
 */
export interface Option<T> {
  /**
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * Arguments passed to and are eagerly evaluated if you are passing the result of a function call, it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   * let y: Option<string>
   *
   * x = Some(2)
   * y = None
   * assertEquals(x.and(y), y)
   *
   * x = None
   * y = Some("foo")
   * assertEquals(x.and(y), x)
   *
   * x = Some(2)
   * y = Some("foo")
   * assertEquals(x.and(y), y)
   *
   * x = None
   * y = None
   * assertEquals(x.and(y), x)
   */
  and<U>(optb: Option<U>): Option<T> | Option<U>;

  /**
   * Returns `None` if the option is `None`, otherwise calls function `f` with the wrapped value and returns the result.
   *
   * Often used to chain fallible operations that may return `None`.
   *
   * Some languages call this operation `flatmap`.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<string>
   * let y: Option<string>
   *
   * x = Some("some value")
   * y = None
   * assertEquals(x.and_then(() => y), y)
   *
   * x = None
   * y = Some("then value")
   * assertEquals(x.and_then(() => y), x)
   *
   * x = Some("some value")
   * y = Some("then value")
   * assertEquals(x.and_then(() => y), y)
   *
   * x = None
   * y = None
   * assertEquals(x.and_then(() => y), x)
   */
  and_then<U>(f: (value: T) => Option<U>): Option<T> | Option<U>;

  /**
   * Returns the contained `Some` value. Throws an error if the value is a `None` with a custom message provided by `msg`.
   *
   * Recommend that expect messages are used to describe the reason you expect the `Option` should be `Some`.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<string>
   *
   * x = Some("value")
   * assertEquals(x.expect("should rerurn string value"), "value")
   *
   * x = None
   * assertThrows(() => x.expect("should rerurn string value"), Error)
   */
  expect(msg: string): T;

  /**
   * Returns `None` if the option is `None`, otherwise calls predicate with the wrapped value and returns:
   *
   * - `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
   * - `None` if predicate returns `false`
   *
   * @since 1.0.0
   *
   * @example
   *
   * function is_even(n: number): boolean {
   *   return n % 2 == 0
   * }
   *
   * assertEquals(None.filter(is_even), None)
   * assertEquals(Some(3).filter(is_even), None)
   * assertEquals(Some(4).filter(is_even), Some(4))
   */
  filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * Calls a function with a reference to the contained value if `Some`.
   *
   * Returns the original option.
   *
   * @since 1.0.0
   *
   * @example
   *
   * function get<T>(arr: T[], idx: number): Option<T> {
   *   const item = arr.at(idx)
   *   return item !== undefined ? Some(item) : None
   * }
   *
   * const list = [1, 2, 3, 4, 5]
   *
   * const x = get(list, 1)
   *   .inspect((v) => console.log("got: " + v))
   *   .expect("list should be long enough")
   *
   * assertEquals(x, 2)
   */
  inspect(f: (value: T) => void): Option<T>;

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(2)
   * assertEquals(x.is_none(), false)
   *
   * x = None
   * assertEquals(x.is_none(), true)
   */
  is_none(): boolean;

  /**
   * Returns `true` if the option is a `None` or the value inside of it matches a predicate.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(2)
   * assertEquals(x.is_none_or((v) => v > 1), true)
   *
   * x = Some(0)
   * assertEquals(x.is_none_or((v) => v > 1), false)
   *
   * x = None
   * assertEquals(x.is_none_or((v) => v > 1), true)
   */
  is_none_or(f: (value: T) => boolean): boolean;

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(2)
   * assertEquals(x.is_some(), true)
   *
   * x = None
   * assertEquals(x.is_some(), false)
   */
  is_some(): boolean;

  /**
   * Checks if the `Option` is `Some` and the value satisfies a predicate
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(2)
   * assertEquals(x.is_some_and((v) => v > 1), true)
   *
   * x = Some(0)
   * assertEquals(x.is_some_and((v) => v > 1), false)
   *
   * x = None
   * assertEquals(x.is_some_and((v) => v > 1), false)
   */
  is_some_and(f: (value: T) => boolean): boolean;

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function `f` to a contained value (if `Some`) or returns `None` (if `None`).
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<string>
   *
   * x = Some("Hello, World!")
   * assertEquals(x.map((s) => s.length), Some(13))
   *
   * x = None
   * assertEquals(x.map((s) => s.length), None)
   */
  map<U>(f: (value: T) => U): Option<U>;

  /**
   * Returns the provided default result (if none), or applies a function `f` to the contained value (if any).
   *
   * If you are passing the result of a function call, it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<string>
   *
   * x = Some("foo")
   * assertEquals(x.map_or(42, (v) => v.length), 3)
   *
   * x = None
   * assertEquals(x.map_or(42, (v) => v.length), 42)
   */
  map_or<U>(default_value: U, f: (value: T) => U): U;

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any).
   *
   * @since 1.0.0
   *
   * @example
   *
   * const k = 21
   * let x: Option<string>
   *
   * x = Some("foo")
   * assertEquals(x.map_or_else(() => 2 * k, (v) => v.length), 3)
   *
   * x = None
   * assertEquals(x.map_or_else(() => 2 * k, (v) => v.length), 42)
   */
  map_or_else<U>(default_f: () => U, f: (value: T) => U): U;

  // TODO: ok_or<E>(err: E): Result<T, E>

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * Arguments passed to or are eagerly evaluated if you are passing the result of a function call, it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   * let y: Option<number>
   *
   * x = Some(2)
   * y = None
   * assertEquals(x.or(y), x)
   *
   * x = None
   * y = Some(100)
   * assertEquals(x.or(y), y)
   *
   * x = Some(2)
   * y = Some(100)
   * assertEquals(x.or(y), x)
   *
   * x = None
   * y = None
   * assertEquals(x.or(y), x)
   */
  or(optb: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls `f` and returns the result.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<string>
   * let y: Option<string>
   *
   * x = Some("barbarians")
   * y = Some("vikings")
   * assertEquals(x.or_else(() => y), x)
   *
   * x = None
   * y = Some("vikings")
   * assertEquals(x.or_else(() => y), y)
   *
   * x = None
   * y = None
   * assertEquals(x.or_else(() => y), x)
   */
  or_else(f: () => Option<T>): Option<T>;

  // TODO: transpose(): Result<Option<T>, E>

  /**
   * Returns the contained `Some` value. Panics if it is `None`.
   *
   * Because this function may throw a TypeError, its use is generally discouraged. Errors are meant for unrecoverable errors, and do abort the entire program.
   *
   * Instead, prefer to use try/catch, promise or pattern matching and handle the `None` case explicitly, or call `unwrap_or` or `unwrap_or_else`.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<string>
   *
   * x = Some("air")
   * assertEquals(x.unwrap(), "air")
   *
   * x = None
   * assertThrows(() => x.unwrap(), TypeError)
   */
  unwrap(): T;

  /**
   * Returns the contained `Some` value or a provided default value.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated if you are passing the result of a function call, it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   *
   * x = Some(42)
   * assertEquals(x.unwrap_or(1), 42)
   *
   * x = None
   * assertEquals(x.unwrap_or(1), 1)
   */
  unwrap_or(default_value: T): T;

  /**
   * Returns the contained Some value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * @since 1.0.0
   *
   * @example
   *
   * const k = 10
   * let x: Option<number>
   *
   * x = Some(4)
   * assertEquals(x.unwrap_or_else(() => 2 * k), 4)
   *
   * x = None
   * assertEquals(x.unwrap_or_else(() => 2 * k), 20)
   */
  unwrap_or_else(f: () => T): T;

  /**
   * Returns `Some` if exactly one of itself, `optb` is `Some`, otherwise returns `None`.
   *
   * @since 1.0.0
   *
   * @example
   *
   * let x: Option<number>
   * let y: Option<number>
   *
   * x = Some(2)
   * y = None
   * assertEquals(x.xor(y), x)
   *
   * x = None
   * y = Some(100)
   * assertEquals(x.xor(y), y)
   *
   * x = Some(2)
   * y = Some(100)
   * assertEquals(x.xor(y), None)
   *
   * x = None
   * y = None
   * assertEquals(x.xor(y), y)
   */
  xor(optb: Option<T>): Option<T>;
}

declare const sid: unique symbol;

/**
 * Some value of type T.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let x = Some(42)
 */
type Some<T> = {
  [sid]: T;
};
declare function Some<T>(value: T): Some<T>;

declare const nid: unique symbol;

/**
 * No value.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let x = None
 */
type None = {
  [nid]: undefined;
};
declare const None: None;

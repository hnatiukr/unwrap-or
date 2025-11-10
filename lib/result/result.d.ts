/**
 * @module Result
 */

/**
 * @since 0.4.0-alpha
 *
 * Type `Result` is a type that represents either success `Ok(T)`
 * and containing a value, or `Err(E)`, representing error
 * and containing an error value.
 *
 * @example
 *
 * ```rs
 * let x: Result<number, string>
 *
 * x = Ok(42)
 * assert_eq!(x, Ok(42))
 *
 * x = Err('empty')
 * assert_eq!(x, Err('empty'))
 * ```
 *
 * @see {@link  https://codeberg.org/hnatiukr/unwrap-or/src/branch/main/lib/result/result.md | Result documentation}
 */
export interface Result<T, E> {
  /**
   * @since 0.4.0-alpha
   *
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * Arguments passed to and are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @example
   *
   * ```rs
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
   */
  and<U>(res: Result<U, E>): Result<T | U, E>;

  /**
   * @since 0.4.0-alpha
   *
   * Calls `op` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * Often used to chain fallible operations that may return `Err`.
   *
   * @example
   *
   * ```rs
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
   */
  and_then<U>(op: (value: T) => Result<U, E>): Result<T | U, E>;

  // TODO: public err() {}

  /**
   * @since 0.4.0-alpha
   *
   * Returns the contained `Ok` value.
   *
   * Because this method may throw, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the `Err` case explicitly,
   * or call `unwrap_or`, `unwrap_or_else`, or `unwrap_or_default`.
   *
   * Recommend that expect messages are used to describe the reason
   * you expect the `Result` should be `Ok`.
   *
   * @throws Panics if the value is an `Err`,
   * with a panic message including the passed message, and the value of the `Err`.
   *
   * @example
   *
   * ```rs
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
   */
  expect(msg: string): T;

  /**
   * @since 0.4.0-alpha
   *
   * Returns the contained `Err` value.
   *
   * @throws Panics if the value is an `Ok`, with a panic message
   * including the passed message, and the content of the Ok.
   *
   * @example
   *
   * ```rs
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
   */
  expect_err(msg: string): E;

  // TODO: public flatten() {}

  /**
   * @since 0.4.0-alpha
   *
   * Calls a function with a reference to the contained value if `Ok`.
   *
   * Returns the original result.
   *
   * @example
   *
   * ```rs
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
   */
  inspect(f: (value: T) => void): Result<T, E>;

  /**
   * @since 0.4.0-alpha
   *
   * Calls a function with a reference to the contained value if `Err`.
   *
   * Returns the original result.
   *
   * @example
   *
   * ```rs
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
   */
  inspect_err(f: (err: E) => void): Result<T, E>;

  /**
   * @since 0.4.0-alpha
   *
   * Returns `true` if the result is `Err`.
   *
   * @example
   *
   * ```rs
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.is_err(), false)
   *
   * x = Err("Not found")
   * assert_eq!(x.is_err(), true)
   * ```
   */
  is_err(): boolean;

  /**
   * @since 0.4.0-alpha
   *
   * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
   *
   * @example
   *
   * ```rs
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
   */
  is_err_and(f: (err: E) => boolean): boolean;

  /**
   * @since 0.4.0-alpha
   *
   * Returns `true` if the result is `Ok`.
   *
   * @example
   *
   * ```rs
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.is_ok(), true)
   *
   * x = Err("Not found")
   * assert_eq!(x.is_ok(), false)
   * ```
   */
  is_ok(): boolean;

  /**
   * @since 0.4.0-alpha
   *
   * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
   *
   * @example
   *
   * ```rs
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
   */
  is_ok_and(f: (value: T) => boolean): boolean;

  /**
   * @since 0.4.0-alpha
   *
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function
   * to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * @example
   *
   * ```rs
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
   */
  map<U>(f: (value: T) => U): Result<T | U, E>;

  /**
   * @since 0.4.0-alpha
   *
   * Returns the provided default (if `Err`),
   * or applies a function to the contained value (if `Ok`).
   *
   * Arguments passed to `map_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @example
   *
   * ```rs
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
   */
  map_or<U>(default_value: U, f: (value: T) => U): U;

  /**
   * @since 0.4.0-alpha
   *
   * Maps a `Result<T, E>` to `U` by applying fallback function `default_f`
   * to a contained `Err` value, or function `f` to a contained `Ok` value.
   *
   * @example
   *
   * ```rs
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
   */
  map_or_else<U>(default_f: () => U, f: (value: T) => U): U;

  // TODO: public ok() {}

  /**
   * @since 0.4.0-alpha
   *
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * Arguments passed to or are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @example
   *
   * ```rs
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
   */
  or(res: Result<T, E>): Result<T, E>;

  /**
   * @since 0.4.0-alpha
   *
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on result values.
   *
   * @example
   *
   * ```rs
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
   */
  or_else(f: () => Result<T, E>): Result<T, E>;

  /**
   * @since 0.4.0-alpha
   *
   * @ignore
   *
   * Returns a string representing this object.
   * This method is meant to be overridden by derived JS objects
   * for custom type coercion logic.
   *
   * @example
   *
   * ```rs
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
   */
  toString(): string;

  // TODO: public transpose() {}

  /**
   * @since 0.4.0-alpha
   *
   * Returns the contained `Ok` value.
   *
   * Because this function may throw, its use is generally discouraged.
   * Prefer to call inside `try/catch` statement, or handle the `Err` case explicitly,
   * or call `unwrap_or`, `unwrap_or_else`, or `unwrap_or_default`.
   *
   * @throws Panics if the value is an `Err`, with a message provided by the `Err`’s value.
   *
   * @example
   *
   * ```rs
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
   */
  unwrap(): T;

  /**
   * @since 0.4.0-alpha
   *
   * Returns the contained `Err` value.
   *
   * @throws Panics if the value is an `Ok`, with a custom panic message provided by the `Ok`’s value.
   *
   * @example
   *
   * ```rs
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
   */
  unwrap_err(): E;

  /**
   * @since 0.4.0-alpha
   *
   * Returns the contained `Ok` value or a provided default.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @example
   *
   * ```rs
   * let x: Result<number, string>;
   *
   * x = Ok(42);
   * assert_eq!(x.unwrap_or(0), 42);
   *
   * x = Err("Not found");
   * assert_eq!(x.unwrap_or(0), 0);
   * ```
   */
  unwrap_or(default_value: T): T;

  /**
   * @since 0.4.0-alpha
   *
   * Returns the contained `Ok` value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * @example
   *
   * ```rs
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
   */
  unwrap_or_else(f: (err: E) => T): T;
}

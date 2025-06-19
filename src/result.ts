/**
 * @module Result
 * @version 0.4.0-alpha
 * @author Roman Hnatiuk <hnatiukr@pm.me>
 * @see https://github.com/hnatiukr/unwrap-or
 * @license MIT
 */

/**
 * Unique id for Ok
 *
 * @private
 */
const oid = Symbol.for("@@result/ok");

/**
 * Unique id for Err
 *
 * @private
 */
const eid = Symbol.for("@@result/err");

/**
 * Type `Result` is a type that represents either success `Ok(T)`
 * and containing a value, or `Err(E)`, representing error
 * and containing an error value.
 *
 * @interface Result
 *
 * @example
 *
 * let x: Result<number, string>
 *
 * x = Ok(42)
 * assert_eq!(x, Ok(42))
 *
 * x = Err('empty')
 * assert_eq!(x, Err('empty'))
 */
export class Result<T, E> {
  protected _extract(): T {
    if (this.is_err()) {
      throw new TypeError("Prevent taking value from `Err(E)`.");
    }

    return (this as any)[oid] as T;
  }

  protected _extract_err(): E {
    if (this.is_ok()) {
      throw new TypeError("Prevent taking err from `Ok(T)`.");
    }

    return (this as any)[eid] as E;
  }

  public constructor(_id: typeof oid, value: T);
  public constructor(_id: typeof eid, err: E);
  public constructor(_id: typeof oid | typeof eid, value?: T | E) {
    (this as any)[_id] = value;
  }

  /**
   * Returns `res` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * Arguments passed to and are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public and<U>(res: Result<U, E>): Result<T | U, E> {
    if (this.is_ok()) {
      return res;
    }

    return new Result(eid, this._extract_err());
  }

  /**
   * Calls `op` if the result is `Ok`, otherwise returns the `Err` value.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * Often used to chain fallible operations that may return `Err`.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public and_then<U>(op: (value: T) => Result<U, E>): Result<T | U, E> {
    if (this.is_ok()) {
      return op(this._extract());
    }

    return new Result<T, E>(eid, this._extract_err());
  }

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
   * @throws Panics if the value is an `Err`,
   * with a panic message including the passed message, and the value of the `Err`.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public expect(msg: string): T {
    if (this.is_ok()) {
      return this._extract();
    }

    const err = this._extract_err();
    const str_err = JSON.stringify(err);

    throw new Error(`${msg}: ${str_err}`);
  }

  /**
   * Returns the contained `Err` value.
   *
   * @throws Panics if the value is an `Ok`, with a panic message
   * including the passed message, and the content of the Ok.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public expect_err(msg: string): E {
    if (this.is_err()) {
      return this._extract_err();
    }

    const value = this._extract();
    const str_value = JSON.stringify(value);

    throw new Error(`${msg}: ${str_value}`);
  }

  // TODO: public flatten() {}

  /**
   * Calls a function with a reference to the contained value if `Ok`.
   *
   * Returns the original result.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public inspect(f: (value: T) => void): Result<T, E> {
    if (this.is_ok()) {
      f(this._extract());
    }

    return this;
  }

  /**
   * Calls a function with a reference to the contained value if `Err`.
   *
   * Returns the original result.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public inspect_err(f: (err: E) => void): Result<T, E> {
    if (this.is_err()) {
      f(this._extract_err());
    }

    return this;
  }

  /**
   * Returns `true` if the result is `Err`.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.is_err(), false)
   *
   * x = Err("Not found")
   * assert_eq!(x.is_err(), true)
   */
  public is_err(): boolean {
    return eid in this;
  }

  /**
   * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public is_err_and(f: (err: E) => boolean): boolean {
    if (this.is_err()) {
      return f(this._extract_err());
    }

    return false;
  }

  /**
   * Returns `true` if the result is `Ok`.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
   * let x: Result<number, string>
   *
   * x = Ok(42)
   * assert_eq!(x.is_ok(), true)
   *
   * x = Err("Not found")
   * assert_eq!(x.is_ok(), false)
   */
  public is_ok(): boolean {
    return oid in this;
  }

  /**
   * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public is_ok_and(f: (value: T) => boolean): boolean {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return false;
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function
   * to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public map<U>(f: (value: T) => U): Result<T | U, E> {
    if (this.is_ok()) {
      return new Result<U, E>(oid, f(this._extract()));
    }

    return new Result<T, E>(eid, this._extract_err());
  }

  /**
   * Returns the provided default (if `Err`),
   * or applies a function to the contained value (if `Ok`).
   *
   * Arguments passed to `map_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public map_or<U>(default_value: U, f: (value: T) => U): U {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return default_value;
  }

  /**
   * Maps a `Result<T, E>` to `U` by applying fallback function `default_f`
   * to a contained `Err` value, or function `f` to a contained `Ok` value.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return default_f();
  }

  // TODO: public ok() {}

  /**
   * Returns `res` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * Arguments passed to or are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public or(res: Result<T, E>): Result<T, E> {
    if (this.is_ok()) {
      return new Result<T, E>(oid, this._extract());
    }

    return res;
  }

  /**
   * Calls `f` if the result is `Err`, otherwise returns the `Ok` value.
   *
   * This function can be used for control flow based on result values.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public or_else(f: () => Result<T, E>): Result<T, E> {
    if (this.is_ok()) {
      return new Result<T, E>(oid, this._extract());
    }

    return f();
  }

  /**
   * Returns a string representing this object.
   * This method is meant to be overridden by derived JS objects
   * for custom type coercion logic.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public toString(): string {
    const value = this.is_ok() ? this._extract() : this._extract_err();

    return this.is_ok() ? `Ok(${value})` : `Err(${value})`;
  }

  /**
   * Overrides Node.js object inspection.
   *
   * @see toString
   */
  public [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.toString();
  }

  // TODO: public transpose() {}

  /**
   * Returns the contained `Ok` value.
   *
   * Because this function may throw, its use is generally discouraged.
   * Prefer to call inside `try/catch` statement, or handle the `Err` case explicitly,
   * or call `unwrap_or`, `unwrap_or_else`, or `unwrap_or_default`.
   *
   * @throws Panics if the value is an `Err`, with a message provided by the `Err`’s value.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public unwrap(): T {
    if (this.is_ok()) {
      return this._extract();
    }

    throw new TypeError("Called Result.unwrap() on an Err value");
  }

  /**
   * Returns the contained `Err` value.
   *
   * @throws Panics if the value is an `Ok`, with a custom panic message provided by the `Ok`’s value.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public unwrap_err(): E {
    if (this.is_err()) {
      return this._extract_err();
    }

    throw new TypeError("Called Result.unwrap_err() on an Ok value");
  }

  /**
   * Returns the contained `Ok` value or a provided default.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated;
   * if you are passing the result of a function call,
   * it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
   * let x: Result<number, string>;
   *
   * x = Ok(42);
   * assert_eq!(x.unwrap_or(0), 42);
   *
   * x = Err("Not found");
   * assert_eq!(x.unwrap_or(0), 0);
   */
  public unwrap_or(default_value: T): T {
    if (this.is_ok()) {
      return this._extract();
    }

    return default_value;
  }

  /**
   * Returns the contained `Ok` value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * @since 0.4.0-alpha
   *
   * @example
   *
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
   */
  public unwrap_or_else(f: (err: E) => T): T {
    if (this.is_ok()) {
      return this._extract();
    }

    return f(this._extract_err());
  }
}

export function Ok<T>(value: T): Result<T, any> {
  return new Result<T, any>(oid, value);
}

export function Err<E>(err: E): Result<any, E> {
  return new Result<any, E>(eid, err);
}

/**
 * @module Option
 */

import { type Result, Ok, Err } from "./result";

/**
 * @internal
 *
 * Unique id for Some
 */
const sid = Symbol.for("@@option/some");

/**
 * @internal
 *
 * Unique id for None
 */
const nid = Symbol.for("@@option/none");

/**
 * @since 0.1.0-alpha
 *
 * @hideconstructor
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
export class Option<T> {
  /**
   * @internal
   * @protected
   */
  protected _extract(): T {
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
  public and<U>(optb: Option<U>): Option<T | U> {
    if (this.is_some()) {
      return optb;
    }

    return new Option<T>(nid);
  }

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
  public and_then<U>(f: (value: T) => Option<U>): Option<T | U> {
    if (this.is_some()) {
      return f(this._extract());
    }

    return new Option<T>(nid);
  }

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
  public expect(msg: string): T {
    if (this.is_some()) {
      return this._extract();
    }

    throw new Error(msg);
  }

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
  public filter(predicate: (value: T) => boolean): Option<T> {
    if (this.is_some() && predicate(this._extract())) {
      return new Option<T>(sid, this._extract());
    }

    return new Option<T>(nid);
  }

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
  public flatten<U>(this: Option<Option<U>>): Option<U> {
    if (this.is_some()) {
      return this._extract();
    }

    return new Option<U>(nid);
  }

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
  public inspect(f: (value: T) => void): Option<T> {
    if (this.is_some()) {
      f(this._extract());
    }

    return this;
  }

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
  public is_none(): boolean {
    return nid in this;
  }

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
  public is_none_or(f: (value: T) => boolean): boolean {
    if (this.is_some()) {
      return f(this._extract());
    }

    return true;
  }

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
  public is_some(): boolean {
    return sid in this;
  }

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
  public is_some_and(f: (value: T) => boolean): boolean {
    if (this.is_some()) {
      return f(this._extract());
    }

    return false;
  }

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
  public map<U>(f: (value: T) => U): Option<T | U> {
    if (this.is_some()) {
      return new Option<U>(sid, f(this._extract()));
    }

    return new Option<T>(nid);
  }

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
  public map_or<U>(default_value: U, f: (value: T) => U): U {
    if (this.is_some()) {
      return f(this._extract());
    }

    return default_value;
  }

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
  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    if (this.is_some()) {
      return f(this._extract());
    }

    return default_f();
  }

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
  public or(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return new Option<T>(sid, this._extract());
    }

    return optb;
  }

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
  public or_else(f: () => Option<T>): Option<T> {
    if (this.is_some()) {
      return new Option<T>(sid, this._extract());
    }

    return f();
  }

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
  public unwrap(): T {
    if (this.is_some()) {
      return this._extract();
    }

    throw new TypeError("Called Option.unwrap() on a None value");
  }

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
  public unwrap_or(default_value: T): T {
    if (this.is_some()) {
      return this._extract();
    }

    return default_value;
  }

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
  public unwrap_or_else(f: () => T): T {
    if (this.is_some()) {
      return this._extract();
    }

    return f();
  }

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
  public xor(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return optb.is_none()
        ? new Option<T>(sid, this._extract())
        : new Option<T>(nid);
    }

    return optb.is_some() ? optb : new Option<T>(nid);
  }
}

/**
 * @since 0.1.0-alpha
 *
 * Some value of type T.
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export function Some<T>(value: T): Option<T> {
  return new Option<T>(sid, value);
}

/**
 * @since 0.1.0-alpha
 *
 * No value.
 *
 * @example
 *
 * let x: Option<number> = None
 */
export const None: Option<any> = new Option<any>(nid);

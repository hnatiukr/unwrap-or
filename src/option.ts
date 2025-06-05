/**
 * @module Option
 * @version 0.4.0-alpha
 * @author Roman Hnatiuk <hnatiukr@pm.me>
 * @see https://github.com/hnatiukr/unwrap-or
 * @license MIT
 */

/**
 * Unique id for Some
 *
 * @private
 */
const sid = Symbol.for("@@option/some");

/**
 * Unique id for None
 *
 * @private
 */
const nid = Symbol.for("@@option/none");

/**
 * Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.
 *
 * @since 0.1.0-alpha
 *
 * @interface Option
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
  protected _extract_value(): T {
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
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * Arguments passed to and are eagerly evaluated if you are passing the result of a function call, it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @since 0.1.0-alpha
   *
   * @example
   *
   * let x: Option<number>
   * let y: Option<string>
   *
   * x = Some(2)
   * y = None
   * assert_eq!(x.and(y), y)
   *
   * x = None
   * y = Some("foo")
   * assert_eq!(x.and(y), x)
   *
   * x = Some(2)
   * y = Some("foo")
   * assert_eq!(x.and(y), y)
   *
   * x = None
   * y = None
   * assert_eq!(x.and(y), x)
   */
  public and<U>(optb: Option<U>): Option<T | U> {
    if (this.is_some()) {
      return optb;
    }

    return new Option<T>(nid);
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls function `f` with the wrapped value and returns the result.
   *
   * Often used to chain fallible operations that may return `None`.
   *
   * Some languages call this operation `flatmap`.
   *
   * @since 0.1.0-alpha
   *
   * @example
   *
   * let x: Option<string>
   * let y: Option<string>
   *
   * x = Some("some value")
   * y = None
   * assert_eq!(x.and_then(() => y), y)
   *
   * x = None
   * y = Some("then value")
   * assert_eq!(x.and_then(() => y), x)
   *
   * x = Some("some value")
   * y = Some("then value")
   * assert_eq!(x.and_then(() => y), y)
   *
   * x = None
   * y = None
   * assert_eq!(x.and_then(() => y), x)
   */
  public and_then<U>(f: (value: T) => Option<U>): Option<T | U> {
    if (this.is_some()) {
      return f(this._extract_value());
    }

    return new Option<T>(nid);
  }

  /**
   * Returns the contained `Some` value.
   *
   * Recommend that expect messages are used to describe the reason you expect the `Option` should be `Some`.
   *
   * @throws Throws an error if the value is a `None` with a custom message provided by `msg`.
   *
   * @since 0.1.0-alpha
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
      return this._extract_value();
    }

    throw new Error(msg);
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls predicate with the wrapped value and returns:
   *
   * - `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
   * - `None` if predicate returns `false`
   *
   * @since 0.1.0-alpha
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
    if (this.is_some() && predicate(this._extract_value())) {
      return new Option<T>(sid, this._extract_value());
    }

    return new Option<T>(nid);
  }

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * Flattening only removes one level of nesting at a time.
   *
   * @since 0.3.0-alpha
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
      return this._extract_value();
    }

    return new Option<U>(nid);
  }

  /**
   * Calls a function with a reference to the contained value if `Some`.
   *
   * Returns the original option.
   *
   * @since 0.1.0-alpha
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
   * assert_eq!(x, 2)
   */
  public inspect(f: (value: T) => void): Option<T> {
    if (this.is_some()) {
      f(this._extract_value());
    }

    return this;
  }

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @since 0.1.0-alpha
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
   * Returns `true` if the option is a `None` or the value inside of it matches a predicate.
   *
   * @since 0.1.0-alpha
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
      return f(this._extract_value());
    }

    return true;
  }

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @since 0.1.0-alpha
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
   * Checks if the `Option` is `Some` and the value satisfies a predicate
   *
   * @since 0.1.0-alpha
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
      return f(this._extract_value());
    }

    return false;
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function `f` to a contained value (if `Some`) or returns `None` (if `None`).
   *
   * @since 0.1.0-alpha
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
      return new Option<U>(sid, f(this._extract_value()));
    }

    return new Option<T>(nid);
  }

  /**
   * Returns the provided default result (if none), or applies a function `f` to the contained value (if any).
   *
   * If you are passing the result of a function call, it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @since 0.1.0-alpha
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
      return f(this._extract_value());
    }

    return default_value;
  }

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any).
   *
   * @since 0.1.0-alpha
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
      return f(this._extract_value());
    }

    return default_f();
  }

  // TODO: ok_or<E>(err: E): Result<T, E>

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * Arguments passed to or are eagerly evaluated if you are passing the result of a function call, it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @since 0.1.0-alpha
   *
   * @example
   *
   * let x: Option<number>
   * let y: Option<number>
   *
   * x = Some(2)
   * y = None
   * assert_eq!(x.or(y), x)
   *
   * x = None
   * y = Some(100)
   * assert_eq!(x.or(y), y)
   *
   * x = Some(2)
   * y = Some(100)
   * assert_eq!(x.or(y), x)
   *
   * x = None
   * y = None
   * assert_eq!(x.or(y), x)
   */
  public or(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return new Option<T>(sid, this._extract_value());
    }

    return optb;
  }

  /**
   * Returns the option if it contains a value, otherwise calls `f` and returns the result.
   *
   * @since 0.1.0-alpha
   *
   * @example
   *
   * let x: Option<string>
   * let y: Option<string>
   *
   * x = Some("barbarians")
   * y = Some("vikings")
   * assert_eq!(x.or_else(() => y), x)
   *
   * x = None
   * y = Some("vikings")
   * assert_eq!(x.or_else(() => y), y)
   *
   * x = None
   * y = None
   * assert_eq!(x.or_else(() => y), x)
   */
  public or_else(f: () => Option<T>): Option<T> {
    if (this.is_some()) {
      return new Option<T>(sid, this._extract_value());
    }

    return f();
  }

  public toString(): string {
    if (this.is_some()) {
      const value = this._extract_value();

      let str = "";

      if (Array.isArray(value)) {
        const elements = value
          .map((item) =>
            typeof item === "string" ? `"${item}"` : String(item),
          )
          .join(", ");
        str = `[${elements}]`;
      } else if (typeof value === "string") {
        str = `"${value}"`;
      } else {
        str = String(value);
      }

      return `Some(${str})`;
    }

    return "None";
  }

  public [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.toString();
  }

  // TODO: transpose(): Result<Option<T>, E>

  /**
   * Returns the contained `Some` value. Panics if it is `None`.
   *
   * Because this function may throw a TypeError, its use is generally discouraged. Errors are meant for unrecoverable errors, and do abort the entire program.
   *
   * Instead, prefer to use try/catch, promise or pattern matching and handle the `None` case explicitly, or call `unwrap_or` or `unwrap_or_else`.
   *
   * @since 0.1.0-alpha
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
   *   "Called `Option.unwrap()` on a `None` value",
   * );
   */
  public unwrap(): T {
    if (this.is_some()) {
      return this._extract_value();
    }

    throw new TypeError("Called `Option.unwrap()` on a `None` value");
  }

  /**
   * Returns the contained `Some` value or a provided default value.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated if you are passing the result of a function call, it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @since 0.1.0-alpha
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
      return this._extract_value();
    }

    return default_value;
  }

  /**
   * Returns the contained Some value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * @since 0.1.0-alpha
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
      return this._extract_value();
    }

    return f();
  }

  /**
   * Returns `Some` if exactly one of itself, `optb` is `Some`, otherwise returns `None`.
   *
   * @since 0.1.0-alpha
   *
   * @example
   *
   * let x: Option<number>
   * let y: Option<number>
   *
   * x = Some(2)
   * y = None
   * assert_eq!(x.xor(y), x)
   *
   * x = None
   * y = Some(100)
   * assert_eq!(x.xor(y), y)
   *
   * x = Some(2)
   * y = Some(100)
   * assert_eq!(x.xor(y), None)
   *
   * x = None
   * y = None
   * assert_eq!(x.xor(y), y)
   */
  public xor(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return optb.is_none()
        ? new Option<T>(sid, this._extract_value())
        : new Option<T>(nid);
    }

    return optb.is_some() ? optb : new Option<T>(nid);
  }
}

/**
 * Some value of type T.
 *
 * @since 0.1.0-alpha
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export function Some<T>(value: T): Option<T> {
  return new Option<T>(sid, value);
}

/**
 * No value.
 *
 * @since 0.1.0-alpha
 *
 * @example
 *
 * let x: Option<number> = None
 */
export const None: Option<any> = new Option<any>(nid);

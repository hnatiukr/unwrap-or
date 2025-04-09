/**
 * @module Option
 *
 * Type Option represents an optional value: every Option is either Some and contains a value, or None, and does not. Option types are very common in Rust code, as they have a number of uses:
 *
 * - Initial values
 * - Return value for otherwise reporting simple errors, where None is returned on error
 * - Optional properies
 * - Optional function arguments
 * - Nullable values
 */

/**
 * Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.
 *
 * @example
 *
 * let option: Option<number> = randInt > 50 ? Some(randInt) : None
 */
export class Option<T> {
  public constructor(protected _value: T) {}

  /**
   * Returns `None` if the option is `None`, otherwise returns `optb`.
   *
   * Arguments passed to and are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `and_then`, which is lazily evaluated.
   *
   * @example
   *
   * let x: Option<number>;
   * let y: Option<string>;
   *
   * x = Some(2);
   * y = None;
   * assertEquals(x.and(y), y);
   *
   * x = None;
   * y = Some("foo");
   * assertEquals(x.and(y), x);
   *
   * x = Some(2);
   * y = Some("foo");
   * assertEquals(x.and(y), y);
   *
   * x = None;
   * y = None;
   * assertEquals(x.and(y), x);
   */
  public and<U>(optb: Option<U>): Option<T> | Option<U> {
    return this.is_none() ? None : optb;
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls function `f` with the wrapped value and returns the result.
   *
   * Often used to chain fallible operations that may return `None`.
   *
   * Some languages call this operation `flatmap`.
   *
   * @example
   *
   * let x: Option<string>;
   * let y: Option<string>;
   *
   * x = Some("some value");
   * y = None;
   * assertEquals(x.and_then(() => y), y);
   *
   * x = None;
   * y = Some("then value");
   * assertEquals(x.and_then(() => y), x);
   *
   * x = Some("some value");
   * y = Some("then value");
   * assertEquals(x.and_then(() => y), y);
   *
   * x = None;
   * y = None;
   * assertEquals(x.and_then(() => y), x);
   */
  public and_then<U>(f: (value: T) => Option<U>): Option<T> | Option<U> {
    return this.is_some() ? f(this._value) : None;
  }

  /**
   * Returns the contained `Some` value. Throws an error if the value is a `None` with a custom message provided by `msg`.
   *
   * Recommend that expect messages are used to describe the reason you expect the `Option` should be `Some`.
   *
   * @example
   *
   * let x: Option<string>;
   *
   * x = Some("value");
   * assertEquals(x.expect("should rerurn string value"), "value");
   *
   * x = None;
   * assertThrows(() => x.expect("should rerurn string value"), Error);
   */
  public expect(msg: string): T {
    if (this.is_some()) {
      return this._value;
    }

    throw new Error(msg);
  }

  /**
   * Returns `None` if the option is `None`, otherwise calls predicate with the wrapped value and returns:
   *
   * - `Some(t)` if predicate returns `true` (where `t` is the wrapped value)
   * - `None` if predicate returns `false`
   *
   * @example
   *
   * function is_even(n: number): boolean {
   *   return n % 2 == 0;
   * }
   *
   * assertEquals(None.filter(is_even), None);
   * assertEquals(Some(3).filter(is_even), None);
   * assertEquals(Some(4).filter(is_even), Some(4));
   */
  public filter(predicate: (value: T) => boolean): Option<T> {
    return this.is_none()
      ? None
      : predicate(this._value)
      ? Some(this._value)
      : None;
  }

  /**
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
   * const x = get(list, 1)
   *   .inspect((v) => console.log("got: " + v))
   *   .expect("list should be long enough");
   *
   * assertEquals(x, 2);
   */
  public inspect(f: (value: T) => void): Option<T> {
    f(this._value);

    return this;
  }

  /**
   * Returns `true` if the option is a `None` value.
   *
   * @example
   *
   * let x: Option<number>;
   *
   * x = Some(2);
   * assertEquals(x.is_none(), false);
   *
   * x = None;
   * assertEquals(x.is_none(), true);
   */
  public is_none(): boolean {
    return this instanceof NoneConstructor;
  }

  /**
   * Returns `true` if the option is a `None` or the value inside of it matches a predicate.
   *
   * @example
   *
   * let x: Option<number>;
   *
   * x = Some(2);
   * assertEquals(x.is_none_or((v) => v > 1), true);
   *
   * x = Some(0);
   * assertEquals(x.is_none_or((v) => v > 1), false);
   *
   * x = None;
   * assertEquals(x.is_none_or((v) => v > 1), true);
   */
  public is_none_or(f: (value: T) => boolean): boolean {
    return this.is_none() ? true : f(this._value);
  }

  /**
   * Returns `true` if the option is a `Some` value.
   *
   * @example
   *
   * let x: Option<number>;
   *
   * x = Some(2);
   * assertEquals(x.is_some(), true);
   *
   * x = None;
   * assertEquals(x.is_some(), false);
   */
  public is_some(): boolean {
    return this instanceof SomeConstructor;
  }

  /**
   * Checks if the `Option` is `Some` and the value satisfies a predicate
   *
   * @example
   *
   * let x: Option<number>;
   *
   * x = Some(2);
   * assertEquals(x.is_some_and((v) => v > 1), true);
   *
   * x = Some(0);
   * assertEquals(x.is_some_and((v) => v > 1), true);
   *
   * x = None;
   * assertEquals(x.is_some_and((v) => v > 1), false);
   */
  public is_some_and(f: (value: T) => boolean): boolean {
    return this.is_some() ? true : f(this._value);
  }

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function `f` to a contained value (if `Some`) or returns `None` (if `None`).
   *
   * @example
   *
   * let x: Option<string>;
   *
   * x = Some("Hello, World!");
   * assertEquals(x.map((s) => s.length), Some(13));
   *
   * x = None;
   * assertEquals(x.map((s) => s.length), None);
   */
  public map<U>(f: (value: T) => U): Option<U> {
    return this.is_some() ? Some(f(this._value)) : None;
  }

  /**
   * Returns the provided default result (if none), or applies a function `f` to the contained value (if any).
   *
   * If you are passing the result of a function call, it is recommended to use `map_or_else`, which is lazily evaluated.
   *
   * @example
   *
   * let x: Option<string>;
   *
   * x = Some("foo");
   * assertEquals(x.map_or(42, (v) => v.length), 3);
   *
   * x = None;
   * assertEquals(x.map_or(42, (v) => v.length), 42);
   */
  public map_or<U>(default_value: U, f: (value: T) => U): U {
    return this.is_some() ? f(this._value) : default_value;
  }

  /**
   * Computes a default function result (if none), or applies a different function to the contained value (if any).
   *
   * @example
   *
   * const k = 21;
   * let x: Option<string>;
   *
   * x = Some("foo");
   * assertEquals(x.map_or_else(() => 2 * k, (v) => v.length), 3);
   *
   * x = None;
   * assertEquals(x.map_or_else(() => 2 * k, (v) => v.length), 42);
   */
  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    return this.is_some() ? f(this._value) : default_f();
  }

  // TODO: ok_or<E>(err: E): Result<T, E>

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  /**
   * Returns the option if it contains a value, otherwise returns `optb`.
   *
   * Arguments passed to or are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `or_else`, which is lazily evaluated.
   *
   * @example
   *
   * let x: Option<number>;
   * let y: Option<number>;
   *
   * x = Some(2);
   * y = None;
   * assertEquals(x.or(y), x);
   *
   * x = None;
   * y = Some(100);
   * assertEquals(x.or(y), y);
   *
   * x = Some(2);
   * y = Some(100);
   * assertEquals(x.or(y), x);
   *
   * x = None;
   * y = None;
   * assertEquals(x.or(y), x);
   */
  public or(optb: Option<T>): Option<T> {
    return this.is_some() ? this : optb;
  }

  /**
   * Returns the option if it contains a value, otherwise calls `f` and returns the result.
   *
   * @example
   *
   * let x: Option<string>;
   * let y: Option<string>;
   *
   * x = Some("barbarians");
   * y = Some("vikings");
   * assertEquals(x.or_else(() => y), x);
   *
   * x = None;
   * y = Some("vikings");
   * assertEquals(x.or_else(() => y), y);
   *
   * x = None;
   * y = None;
   * assertEquals(x.or_else(() => y), x);
   */
  public or_else(f: () => Option<T>): Option<T> {
    return this.is_some() ? this : f();
  }

  // TODO: to_string()

  /**
   * Returns a string representation of the `Option`, useful for implicit string coercion.
   *
   * @example
   *
   * let x: Option<unknown>;
   *
   * x = Some(true);
   * assertEquals(x.toString(), "Some(true)");
   *
   * x = Some(42);
   * assertEquals(x.toString(), "Some(42)");
   *
   * x = Some("hello");
   * assertEquals(x.toString(), 'Some("hello")');
   *
   * x = Some([1, 2]);
   * assertEquals(x.toString(), "Some([1, 2])");
   *
   * x = Some({});
   * assertEquals(x.toString(), "Some([object Object])");
   *
   * x = None;
   * assertEquals(x.toString(), "None");
   */
  public toString(): string {
    if (this.is_some()) {
      let str = "";

      if (Array.isArray(this._value)) {
        const elements = this._value
          .map((item) => typeof item === "string" ? `"${item}"` : String(item))
          .join(", ");

        str = `[${elements}]`;
      } else if (typeof this._value === "string") {
        str = `"${this._value}"`;
      } else {
        str = String(this._value);
      }

      return `Some(${str})`;
    }

    return "None";
  }

  /**
   * Returns a string representation of the `Option`, useful for implicit string coercion.
   *
   * Specific method for compatibility with Node.js API to implement `toString` method.
   *
   * @see Option.toString
   */
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
   * @example
   *
   * let x: Option<string>;
   *
   * x = Some("air");
   * assertEquals(x.unwrap(), "air");
   *
   * x = None;
   * assertThrows(() => x.unwrap(), TypeError);
   */
  public unwrap(): T {
    if (this.is_some()) {
      return this._value;
    }

    throw new TypeError("Called `Option.unwrap()` on a `None` value");
  }

  /**
   * Returns the contained `Some` value or a provided default value.
   *
   * Arguments passed to `unwrap_or` are eagerly evaluated; if you are passing the result of a function call, it is recommended to use `unwrap_or_else`, which is lazily evaluated.
   *
   * @example
   *
   * let x: Option<number>;
   *
   * x = Some(42);
   * assertEquals(x.unwrap_or(1), 42);
   *
   * x = None;
   * assertEquals(x.unwrap_or(1), 1);
   */
  public unwrap_or(default_value: T): T {
    return this.is_some() ? this._value : default_value;
  }

  /**
   * Returns the contained Some value or computes it from a closure.
   *
   * Useful for expensive default computations.
   *
   * @example
   *
   * const k = 10;
   * let x: Option<number>;
   *
   * x = Some(4);
   * assertEquals(x.unwrap_or_else(() => 2 * k), 4);
   *
   * x = None;
   * assertEquals(x.unwrap_or_else(() => 2 * k), 20);
   */
  public unwrap_or_else(f: () => T): T {
    return this.is_some() ? this._value : f();
  }

  /**
   * Returns `Some` if exactly one of itself, `optb` is `Some`, otherwise returns `None`.
   *
   * @example
   *
   * let x: Option<number>;
   * let y: Option<number>;
   *
   * x = Some(2);
   * y = None;
   * assertEquals(x.xor(y), x);
   *
   * x = None;
   * y = Some(100);
   * assertEquals(x.xor(y), y);
   *
   * x = Some(2);
   * y = Some(100);
   * assertEquals(x.xor(y), None);
   *
   * x = None;
   * y = None;
   * assertEquals(x.xor(y), y);
   */
  public xor(optb: Option<T>): Option<T> {
    if (this.is_some() !== optb.is_some()) {
      return this.is_some() ? this : optb;
    }

    return None;
  }
}

/**
 * Constructor for Some type of Option.
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export class SomeConstructor<T> extends Option<T> implements Option<T> {
  public constructor(value: T) {
    super(value);
  }
}

/**
 * Some value of type T.
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export interface Some<T> extends SomeConstructor<T> {}
export const Some = <T>(value: T) => new SomeConstructor(value) as Some<T>;

/**
 * Constructor for None type of Option.
 *
 * @example
 *
 * let x: Option<number> = None
 */
export class NoneConstructor extends Option<never> implements Option<never> {
  public constructor() {
    super(undefined as never);
  }
}

/**
 * No value.
 *
 * @example
 *
 * let x: Option<number> = None
 */
export interface None extends NoneConstructor {}
export const None: None = new NoneConstructor();

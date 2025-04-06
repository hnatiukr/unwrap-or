/**
 * Base abstract class for the `Option` type monad.
 */
abstract class OptionConstructor<T> {
  protected _value: T | undefined;

  public constructor(value: T | undefined) {
    this._value = value;
  }

  /**
   * Checks if the `Option` is a `Some`
   *
   * @example
   * const some = Some(42)
   * some.is_some() // true
   *
   * const none = None
   * some.is_some() // false
   */
  public is_some(): boolean {
    return this instanceof Some;
  }

  /**
   * Checks if the `Option` is a `None`
   *
   * @example
   * const some = Some(42)
   * some.is_none() // false
   *
   * const none = None
   * some.is_none() // true
   */
  public is_none(): boolean {
    return this instanceof None;
  }

  /**
   * Filters an Option based on a predicate function.
   * Returns `Some` if the `Option` is `Some` and the predicate returns `true`, otherwise `None`.
   *
   * @example
   * const some = Some(42)
   * some.filter(x => x > 40) // Some(42)
   * some.filter(x => x < 40) // None
   *
   * const none = None
   * none.filter(x => true) // None
   */
  public filter(
    predicate: (value: NonNullable<T>) => boolean,
  ): Some<NonNullable<T>> | None {
    if (this instanceof None) {
      return new None();
    } else {
      return predicate(this._value as NonNullable<T>)
        ? new Some(this._value as NonNullable<T>)
        : new None();
    }
  }

  /**
   * Transforms the `Option`'s value if it is `Some`, or throws if `None`
   *
   * @example
   * const some = Some(42)
   * some.map(x => x.toString()) // "42"
   *
   * const none = None
   * none.map(x => x.toString()) // ! Throws TypeError
   */
  public map<R>(transform: (value: NonNullable<T>) => R): R | never {
    if (this instanceof Some) {
      return transform(this._value as NonNullable<T>);
    } else {
      throw new TypeError('Attempted to map a "None" value');
    }
  }

  /**
   * Transforms the `Option`'s value if it is `Some`, or returns the provided default value if `None`.
   *
   * @example
   * const some = Some(42)
   * some.map_or(x => x * 2, 0) // 84
   *
   * const none = None
   * none.map_or(x => x * 2, 0) // 0
   */
  public map_or<R, V>(
    transform: (value: NonNullable<T>) => R,
    value: V,
  ): R | V {
    if (this instanceof Some) {
      return transform(this._value as NonNullable<T>);
    } else {
      return value;
    }
  }

  /**
   * Returns a string representation of the `Option`.
   * Overridden method for compatibility with browser's API.
   *
   * @example
   * Some(42).toString() // 'Some(42)'
   * None.toString() // 'None'
   */
  public toString(): string {
    if (this instanceof Some) {
      return "Some" + "(" + this._value + ")";
    }

    return "None";
  }

  /**
   * Returns a string representation of the `Option`
   * Overridden method for compatibility with Node.js API.
   *
   * @example
   * Some(42).toString() // 'Some(42)'
   * None.toString() // 'None'
   */
  public [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.toString();
  }

  /**
   * Checks if the `Option` is `Some` and the value satisfies a predicate
   *
   * @example
   * const some = Some(42)
   * some.is_some_and(x => x > 30) // true
   * some.is_some_and(x => x < 30) // false
   *
   * const none = None
   * none.is_some_and(x => true) // false (always false for `None`)
   */
  abstract is_some_and(predicate: (value: T) => boolean): boolean;

  /**
   * Checks if the `Option` is `None` or the value satisfies a predicate
   *
   * @example
   * const some = Some(42)
   * some.is_none_or(x => x > 30) // true
   * some.is_none_or(x => x < 30) // false
   *
   * const value = None
   * value.is_none_or(x => false) // true (always true for `None`)
   */
  abstract is_none_or(predicate: (value: T) => boolean): boolean;

  /**
   * Extracts the value from the `Option` if it is `Some`
   *
   * @example
   * const some = Some(42)
   * some.unwrap() // 42
   *
   * const none = None
   * none.unwrap() // Throws TypeError: Attempted to unwrap a "None" value
   */
  abstract unwrap(): T | never;

  /**
   * Extracts the value from the `Option` if it is `Some`, or returns the default value if `None`
   *
   * @example
   * const some = Some(42)
   * some.unwrap_or(1) // 42
   *
   * const none = None
   * none.unwrap_or(1) // 1
   */
  abstract unwrap_or<R>(default_value: R): T | R;

  /**
   * Extracts the value from the `Option` if it is `Some`, or lazy computes a default value using the provided function.
   * Useful for expensive default computations.
   *
   * @example
   * const some = Some(42)
   * some.unwrap_or_else(() => expensiveCalculation()) // 42
   *
   * const none = None
   * none.unwrap_or_else(() => expensiveCalculation()) // result of expensiveCalculation()
   */
  abstract unwrap_or_else<R>(lazy: () => R): T | R;

  /**
   * Extracts the value from the `Option` if it is `Some`, or throws with the provided message
   *
   * @example
   * const some = Some(42)
   * some.expect("Failed to get value") // 42
   *
   * const none = None
   * none.expect("Failed to get user configuration") // Throws Error with message "Failed to get user configuration"
   */
  abstract expect(message: string): T | never;
}

export class Some<T> extends OptionConstructor<T> {
  public constructor(value: T) {
    super(value);
  }

  public override is_some(): true {
    return true;
  }

  public override is_none(): false {
    return false;
  }

  public is_some_and(predicate: (value: T) => boolean): boolean {
    return predicate(this._value as T);
  }

  public is_none_or(predicate: (value: T) => boolean): boolean {
    return predicate(this._value as T);
  }

  public unwrap(): T {
    return this._value as T;
  }

  public unwrap_or<R>(_default_value: R): T {
    return this._value as T;
  }

  public unwrap_or_else<R>(_lazy: () => R): T {
    return this._value as T;
  }

  public expect(_message: string): T {
    return this._value as T;
  }

  public override map<R>(transform: (value: NonNullable<T>) => R): R {
    return transform(this._value as NonNullable<T>);
  }

  public override map_or<R, V>(
    transform: (value: NonNullable<T>) => R,
    _value: V,
  ): R {
    return transform(this._value as NonNullable<T>);
  }
}

export class None extends OptionConstructor<undefined> {
  public constructor() {
    super(undefined);
  }

  public override is_some(): false {
    return false;
  }

  public override is_none(): true {
    return true;
  }

  public is_some_and(_predicate: (value: never) => boolean): false {
    return false;
  }

  public is_none_or(_predicate: (value: never) => boolean): true {
    return true;
  }

  public unwrap(): never {
    throw new TypeError('Attempted to unwrap a "None" value');
  }

  public unwrap_or<R>(default_value: R): R {
    return default_value;
  }

  public unwrap_or_else<R>(lazy: () => R): R {
    return lazy();
  }

  public expect(message: string): never {
    throw new Error(message);
  }

  public override map<R>(_transform: (value: never) => R): never {
    throw new TypeError('Attempted to map a "None" value');
  }

  public override map_or<R, V>(_transform: (value: never) => R, value: V): V {
    return value;
  }
}

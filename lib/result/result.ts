/**
 * @module Result
 */

import type { Result } from "./result.d.ts";

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

  public and<U>(res: Result<U, E>): Result<T | U, E> {
    if (this.is_ok()) {
      return res;
    }

    return new ResultConstructor<T, E>(eid, this._extract_err());
  }

  public and_then<U>(op: (value: T) => Result<U, E>): Result<T | U, E> {
    if (this.is_ok()) {
      return op(this._extract());
    }

    return new ResultConstructor<T, E>(eid, this._extract_err());
  }

  // TODO: public err() {}

  public expect(msg: string): T {
    if (this.is_ok()) {
      return this._extract();
    }

    const err = this._extract_err();
    const str_err = JSON.stringify(err);

    throw new Error(`${msg}: ${str_err}`);
  }

  public expect_err(msg: string): E {
    if (this.is_err()) {
      return this._extract_err();
    }

    const value = this._extract();
    const str_value = JSON.stringify(value);

    throw new Error(`${msg}: ${str_value}`);
  }

  // TODO: public flatten() {}

  public inspect(f: (value: T) => void): Result<T, E> {
    if (this.is_ok()) {
      f(this._extract());
    }

    return this;
  }

  public inspect_err(f: (err: E) => void): Result<T, E> {
    if (this.is_err()) {
      f(this._extract_err());
    }

    return this;
  }

  public is_err(): boolean {
    return eid in this;
  }

  public is_err_and(f: (err: E) => boolean): boolean {
    if (this.is_err()) {
      return f(this._extract_err());
    }

    return false;
  }

  public is_ok(): boolean {
    return oid in this;
  }

  public is_ok_and(f: (value: T) => boolean): boolean {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return false;
  }

  public map<U>(f: (value: T) => U): Result<T | U, E> {
    if (this.is_ok()) {
      return new ResultConstructor<U, E>(oid, f(this._extract()));
    }

    return new ResultConstructor<T, E>(eid, this._extract_err());
  }

  public map_or<U>(default_value: U, f: (value: T) => U): U {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return default_value;
  }

  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    if (this.is_ok()) {
      return f(this._extract());
    }

    return default_f();
  }

  // TODO: public ok() {}

  public or(res: Result<T, E>): Result<T, E> {
    if (this.is_ok()) {
      return new ResultConstructor<T, E>(oid, this._extract());
    }

    return res;
  }

  public or_else(f: () => Result<T, E>): Result<T, E> {
    if (this.is_ok()) {
      return new ResultConstructor<T, E>(oid, this._extract());
    }

    return f();
  }

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

  public unwrap(): T {
    if (this.is_ok()) {
      return this._extract();
    }

    throw new TypeError("Called Result.unwrap() on an Err value");
  }

  public unwrap_err(): E {
    if (this.is_err()) {
      return this._extract_err();
    }

    throw new TypeError("Called Result.unwrap_err() on an Ok value");
  }

  public unwrap_or(default_value: T): T {
    if (this.is_ok()) {
      return this._extract();
    }

    return default_value;
  }

  public unwrap_or_else(f: (err: E) => T): T {
    if (this.is_ok()) {
      return this._extract();
    }

    return f(this._extract_err());
  }
}

/**
 * @since 0.4.0-alpha
 *
 * Contains the success value.
 *
 * @example
 *
 * let x: Result<number, string> = Ok(42)
 */
export function Ok<T>(value: T): Result<T, any> {
  return new ResultConstructor<T, any>(oid, value);
}

/**
 * @since 0.4.0-alpha
 *
 * Contains the error value.
 *
 * @example
 *
 * let x: Result<number, string> = Err("Not found")
 */
export function Err<E>(err: E): Result<any, E> {
  return new ResultConstructor<any, E>(eid, err);
}

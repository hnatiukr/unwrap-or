/**
 * @module Option
 */

import { Err, Ok } from "../result/index.ts";
import type { Result } from "../result/index.ts";
import type { Option } from "./option.d.ts";

/**
 * @internal
 *
 * Unique id for Some
 */
const sid = Symbol.for("@@option/some");

/**
 * @internal
 *
 * Unique id for Some
 */
const nid = Symbol.for("@@option/none");

/**
 * @internal
 *
 * Option constructor
 */
class OptionConstructor<T> implements Option<T> {
  /**
   * @internal
   * @private
   */
  private _extract(): T {
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

  public and<U>(optb: Option<U>): Option<T | U> {
    if (this.is_some()) {
      return optb;
    }

    return new OptionConstructor<T>(nid);
  }

  public and_then<U>(f: (value: T) => Option<U>): Option<T | U> {
    if (this.is_some()) {
      return f(this._extract());
    }

    return new OptionConstructor<T>(nid);
  }

  public expect(msg: string): T {
    if (this.is_some()) {
      return this._extract();
    }

    throw new Error(msg);
  }

  public filter(predicate: (value: T) => boolean): Option<T> {
    if (this.is_some() && predicate(this._extract())) {
      return new OptionConstructor<T>(sid, this._extract());
    }

    return new OptionConstructor<T>(nid);
  }

  public flatten<U>(this: Option<Option<U>>): Option<U> {
    if (this.is_some()) {
      return (this as any)._extract();
    }

    return new OptionConstructor<U>(nid);
  }

  public inspect(f: (value: T) => void): Option<T> {
    if (this.is_some()) {
      f(this._extract());
    }

    return this;
  }

  public is_none(): boolean {
    return nid in this;
  }

  public is_none_or(f: (value: T) => boolean): boolean {
    if (this.is_some()) {
      return f(this._extract());
    }

    return true;
  }

  public is_some(): boolean {
    return sid in this;
  }

  public is_some_and(f: (value: T) => boolean): boolean {
    if (this.is_some()) {
      return f(this._extract());
    }

    return false;
  }

  public map<U>(f: (value: T) => U): Option<T | U> {
    if (this.is_some()) {
      return new OptionConstructor<U>(sid, f(this._extract()));
    }

    return new OptionConstructor<T>(nid);
  }

  public map_or<U>(default_value: U, f: (value: T) => U): U {
    if (this.is_some()) {
      return f(this._extract());
    }

    return default_value;
  }

  public map_or_else<U>(default_f: () => U, f: (value: T) => U): U {
    if (this.is_some()) {
      return f(this._extract());
    }

    return default_f();
  }

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

  public or(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return new OptionConstructor<T>(sid, this._extract());
    }

    return optb;
  }

  public or_else(f: () => Option<T>): Option<T> {
    if (this.is_some()) {
      return new OptionConstructor<T>(sid, this._extract());
    }

    return f();
  }

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

  public unwrap(): T {
    if (this.is_some()) {
      return this._extract();
    }

    throw new TypeError("Called Option.unwrap() on a None value");
  }

  public unwrap_or(default_value: T): T {
    if (this.is_some()) {
      return this._extract();
    }

    return default_value;
  }

  public unwrap_or_else(f: () => T): T {
    if (this.is_some()) {
      return this._extract();
    }

    return f();
  }

  public xor(optb: Option<T>): Option<T> {
    if (this.is_some()) {
      return optb.is_none()
        ? new OptionConstructor<T>(sid, this._extract())
        : new OptionConstructor<T>(nid);
    }

    return optb.is_some() ? optb : new OptionConstructor<T>(nid);
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
  return new OptionConstructor<T>(sid, value);
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
export const None: Option<any> = new OptionConstructor<any>(nid);

/**
 * @module Option
 * @version 0.1.1-alpha
 * @author Roman Hnatiuk <hnatiukr@pm.me>
 * @see https://github.com/hnatiukr/unwrap-or
 * @license MIT
 */

import { NoneConstructor } from "./none";
import type { OptionConstructor } from "./option";

const sid = Symbol.for("@@option/some");

export class SomeConstructor<T> implements OptionConstructor<T> {
  private _take(): T {
    if (this.is_none()) {
      throw new TypeError("Prevent taking value from `None`.");
    }

    return (this as any)[sid] as T;
  }

  public constructor(value: T) {
    (this as any)[sid] = value;
  }

  public and<U>(optb: OptionConstructor<U>): OptionConstructor<U> {
    return optb;
  }

  public and_then<U>(
    f: (value: T) => OptionConstructor<U>,
  ): OptionConstructor<U> {
    return f(this._take());
  }

  public expect(msg: string): T {
    return this._take();
  }

  public filter(predicate: (value: T) => boolean): OptionConstructor<T> {
    return predicate(this._take())
      ? new SomeConstructor(this._take())
      : new NoneConstructor();
  }

  public inspect(f: (value: T) => void): SomeConstructor<T> {
    f(this._take());

    return this;
  }

  public is_none(): this is NoneConstructor {
    return false;
  }

  public is_none_or(f: (value: T) => boolean): boolean {
    return f(this._take());
  }

  public is_some(): this is SomeConstructor<T> {
    return true;
  }

  public is_some_and(f: (value: T) => boolean): boolean {
    return f(this._take());
  }

  public map<U>(f: (value: T) => U): SomeConstructor<U> {
    return new SomeConstructor(f(this._take()));
  }

  public map_or<U>(_default_value: U, f: (value: T) => U): U {
    return f(this._take());
  }

  public map_or_else<U>(_default_f: () => U, f: (value: T) => U): U {
    return f(this._take());
  }

  // TODO: ok_or<E>(err: E): Result<T, E>

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  public or(optb: OptionConstructor<T>): SomeConstructor<T> {
    return new SomeConstructor(this._take());
  }

  public or_else(f: () => OptionConstructor<T>): SomeConstructor<T> {
    return new SomeConstructor(this._take());
  }

  public toString(): string {
    const value = this._take();

    let str = "";
    if (Array.isArray(value)) {
      const elements = value
        .map((item) => (typeof item === "string" ? `"${item}"` : String(item)))
        .join(", ");
      str = `[${elements}]`;
    } else if (typeof value === "string") {
      str = `"${value}"`;
    } else {
      str = String(value);
    }

    return `Some(${str})`;
  }

  public [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.toString();
  }

  // TODO: transpose(): Result<Option<T>, E>

  public unwrap(): T {
    return this._take();
  }

  public unwrap_or(_default_value: T): T {
    return this._take();
  }

  public unwrap_or_else(_f: () => T): T {
    return this._take();
  }

  public xor(optb: OptionConstructor<T>): OptionConstructor<T> {
    if (optb.is_none()) {
      return new SomeConstructor(this._take());
    }

    return new NoneConstructor();
  }
}

/**
 * Some value of type T.
 *
 * @since 0.1.1-alpha
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export interface Some<T> extends SomeConstructor<T> {}
/**
 * Some value of type T.
 *
 * @since 0.1.1-alpha
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export function Some<T>(value: T) {
  return new SomeConstructor(value) as Some<T>;
}

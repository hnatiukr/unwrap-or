/**
 * @module Option
 * @version 0.1.1-alpha
 * @author Roman Hnatiuk <hnatiukr@pm.me>
 * @see https://github.com/hnatiukr/unwrap-or
 * @license MIT
 */

import type { OptionConstructor } from "./option";

const nid = Symbol.for("@@option/none");

export class NoneConstructor implements OptionConstructor<never> {
  public constructor() {
    (this as any)[nid] = undefined;
  }

  public and<U>(_optb: OptionConstructor<U>): NoneConstructor {
    return new NoneConstructor();
  }

  public and_then<U>(
    _f: (value: never) => OptionConstructor<U>,
  ): NoneConstructor {
    return new NoneConstructor();
  }

  public expect(msg: string): never {
    throw new Error(msg);
  }

  public filter(_predicate: (value: never) => boolean): NoneConstructor {
    return new NoneConstructor();
  }

  public inspect(_f: (value: never) => void): NoneConstructor {
    return this;
  }

  public is_none(): this is NoneConstructor {
    return true;
  }

  public is_none_or(_f: (value: never) => boolean): true {
    return true;
  }

  public is_some(): false {
    return false;
  }

  public is_some_and(_f: (value: never) => boolean): false {
    return false;
  }

  public map<U>(_f: (value: never) => U): NoneConstructor {
    return new NoneConstructor();
  }

  public map_or<U>(default_value: U, f: (value: never) => U): U {
    return default_value;
  }

  public map_or_else<U>(default_f: () => U, _f: (value: never) => U): U {
    return default_f();
  }

  // TODO: ok_or<E>(err: E): Result<T, E>

  // TODO: ok_or_else<E, F>(err: F): Result<T, E>

  public or<T>(optb: OptionConstructor<T>): OptionConstructor<T> {
    return optb;
  }

  public or_else<T>(f: () => OptionConstructor<T>): OptionConstructor<T> {
    return f();
  }

  public toString(): string {
    return "None";
  }

  public [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.toString();
  }

  // TODO: transpose(): Result<Option<T>, E>

  public unwrap(): never {
    throw new TypeError("Called `Option.unwrap()` on a `None` value");
  }

  public unwrap_or<T>(default_value: T): T {
    return default_value;
  }

  public unwrap_or_else<T>(f: () => T): T {
    return f();
  }

  public xor<T>(optb: OptionConstructor<T>): OptionConstructor<T> {
    return optb.is_some() ? optb : new NoneConstructor();
  }
}

/**
 * No value.
 *
 * @since 0.1.1-alpha
 *
 * @example
 *
 * let x: Option<number> = None
 */
export interface None extends NoneConstructor {}
export const None: None = new NoneConstructor() as None;

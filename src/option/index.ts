/**
 * @module Option
 */

import type { Option as OptionConstructor } from "./option.d";

const sid = Symbol.for("@@option/some");
const nid = Symbol.for("@@option/none");

class SomeConstructor<T> implements OptionConstructor<T> {
  private _take(): T {
    if (this.is_none()) {
      throw new TypeError("Prevent taking value from `None`.");
    }

    return (this as any)[sid] as T;
  }

  public constructor(value: T) {
    (this as any)[sid] = value;
  }

  public and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  public and_then<U>(f: (value: T) => Option<U>): Option<U> {
    return f(this._take());
  }

  public expect(msg: string): T {
    return this._take();
  }

  public filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this._take())
      ? new SomeConstructor(this._take())
      : new NoneConstructor();
  }

  public inspect(f: (value: T) => void): Some<T> {
    f(this._take());

    return this;
  }

  public is_none(): this is None {
    return false;
  }

  public is_none_or(f: (value: T) => boolean): boolean {
    return f(this._take());
  }

  public is_some(): this is Some<T> {
    return true;
  }

  public is_some_and(f: (value: T) => boolean): boolean {
    return f(this._take());
  }

  public map<U>(f: (value: T) => U): Some<U> {
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

  public or(optb: Option<T>): Some<T> {
    return new SomeConstructor(this._take());
  }

  public or_else(f: () => Option<T>): Some<T> {
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

  public unwrap_or(default_value: T): T {
    return this._take();
  }

  public unwrap_or_else(f: () => T): T {
    return this._take();
  }

  public xor(optb: Option<T>): Option<T> {
    if (optb.is_none()) {
      return new SomeConstructor(this._take());
    }

    return new NoneConstructor();
  }
}

class NoneConstructor implements OptionConstructor<never> {
  public constructor() {
    (this as any)[nid] = undefined;
  }

  public and<U>(_optb: Option<U>): None {
    return new NoneConstructor();
  }

  public and_then<U>(_f: (value: never) => Option<U>): None {
    return new NoneConstructor();
  }

  public expect(msg: string): never {
    throw new Error(msg);
  }

  public filter(_predicate: (value: never) => boolean): None {
    return new NoneConstructor();
  }

  public inspect(_f: (value: never) => void): None {
    return this;
  }

  public is_none(): this is None {
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

  public map<U>(_f: (value: never) => U): None {
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

  public or<T>(optb: Option<T>): Option<T> {
    return optb;
  }

  public or_else<T>(f: () => Option<T>): Option<T> {
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

  public xor<T>(optb: Option<T>): Option<T> {
    return optb.is_some() ? optb : new NoneConstructor();
  }
}

/**
 * Some value of type T.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
interface Some<T> extends SomeConstructor<T> {}
/**
 * Some value of type T.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let x: Option<number> = Some(42)
 */
export function Some<T>(value: T) {
  return new SomeConstructor(value) as Some<T>;
}

/**
 * No value.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let x: Option<number> = None
 */
interface None extends NoneConstructor {}
/**
 * No value.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let x: Option<number> = None
 */
export const None: None = new NoneConstructor() as None;

/**
 * Type `Option` represents an optional value: every `Option` is either `Some` and contains a value, or `None`, and does not.
 *
 * @since 1.0.0
 *
 * @example
 *
 * let option: Option<number> = randInt > 50 ? Some(randInt) : None
 */
export type Option<T> = Some<T> | None;

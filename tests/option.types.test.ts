import { describe, test, expectTypeOf } from "vitest";

import { Some, None, type Option } from "../src/option";
import { Ok, Err, type Result } from "../src/result";

describe("Option", () => {
  test("and", () => {
    let x: Option<number>;
    let y: Option<string>;

    x = Some(2);
    y = None;
    expectTypeOf(x.and(y)).toEqualTypeOf<Option<string | number>>;

    x = None;
    y = Some("foo");
    expectTypeOf(x.and(y)).toEqualTypeOf<Option<string | number>>;

    x = Some(2);
    y = Some("foo");
    expectTypeOf(x.and(y)).toEqualTypeOf<Option<string | number>>;

    x = None;
    y = None;
    expectTypeOf(x.and(y)).toEqualTypeOf<Option<string | number>>;
  });

  test("and_then", () => {
    let x: Option<string>;
    let y: Option<string>;

    x = Some("some value");
    y = None;
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<Option<string>>;

    x = None;
    y = Some("then value");
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<Option<string>>;

    x = Some("some value");
    y = Some("then value");
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<Option<string>>;

    x = None;
    y = None;
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<Option<string>>;
  });

  test("expect", () => {
    let x: Option<number>;

    x = Some(42);
    expectTypeOf(x.expect("should return number value")).toEqualTypeOf<number>;
  });

  test("filter", () => {
    function is_even(n: number): boolean {
      return n % 2 == 0;
    }

    let x: Option<number>;
    let y: Option<number>;

    x = Some(3);
    y = None;
    expectTypeOf(x.filter(is_even)).toEqualTypeOf<Option<number>>;
    expectTypeOf(y.filter(is_even)).toEqualTypeOf<Option<number>>;
  });

  test("flatten", () => {
    let x: Option<Option<number>>;

    x = Some(Some(6));
    expectTypeOf(x.flatten()).toEqualTypeOf<Option<number>>;

    x = Some(None);
    expectTypeOf(x.flatten()).toEqualTypeOf<Option<number>>;

    x = None;
    expectTypeOf(x.flatten()).toEqualTypeOf<Option<number>>;
  });

  test("inspect", () => {
    function get<T>(arr: T[], idx: number): Option<T> {
      const item = arr.at(idx);
      return item !== undefined ? Some(item) : None;
    }

    const list = [1, 2, 3, 4, 5];

    let x: Option<number>;

    x = get(list, 1).inspect((_v) => console.log);
    expectTypeOf(x).toEqualTypeOf<Option<number>>;

    x = get(list, 9).inspect((_v) => console.log);
    expectTypeOf(x).toEqualTypeOf<Option<number>>;
  });

  test("is_none", () => {
    let x: Option<number>;

    x = Some(2);
    expectTypeOf(x.is_none()).toEqualTypeOf<boolean>;

    x = None;
    expectTypeOf(x.is_none()).toEqualTypeOf<boolean>;
  });

  test("is_none_or", () => {
    let x: Option<number>;

    x = Some(2);
    expectTypeOf(x.is_none_or((v) => v > 1)).toEqualTypeOf<boolean>;

    x = Some(0);
    expectTypeOf(x.is_none_or((v) => v > 1)).toEqualTypeOf<boolean>;

    x = None;
    expectTypeOf(x.is_none_or((v) => v > 1)).toEqualTypeOf<boolean>;
  });

  test("is_some", () => {
    let x: Option<number>;

    x = Some(2);
    expectTypeOf(x.is_some()).toEqualTypeOf<boolean>;

    x = None;
    expectTypeOf(x.is_some()).toEqualTypeOf<boolean>;
  });

  test("is_some_and", () => {
    let x: Option<number>;

    x = Some(2);
    expectTypeOf(x.is_some_and((v) => v > 1)).toEqualTypeOf<boolean>;

    x = Some(0);
    expectTypeOf(x.is_some_and((v) => v > 1)).toEqualTypeOf<boolean>;

    x = None;
    expectTypeOf(x.is_some_and((v) => v > 1)).toEqualTypeOf<boolean>;
  });

  test("map", () => {
    let x: Option<string>;

    x = Some("Hello, World!");
    expectTypeOf(x.map((s) => s.length)).toEqualTypeOf<Option<string | number>>;

    x = None;
    expectTypeOf(x.map((s) => s.length)).toEqualTypeOf<Option<string | number>>;
  });

  test("map_or", () => {
    let x: Option<string>;

    x = Some("foo");
    expectTypeOf(x.map_or(42, (v) => v.length)).toEqualTypeOf<number>;

    x = None;
    expectTypeOf(x.map_or(42, (v) => v.length)).toEqualTypeOf<number>;
  });

  test("map_or_else", () => {
    const k = 21;
    let x: Option<string>;

    x = Some("foo");
    expectTypeOf(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
    ).toEqualTypeOf<number>;

    x = None;
    expectTypeOf(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
    ).toEqualTypeOf<number>;
  });

  test("ok_or", () => {
    let x: Option<number> | Result<number, string>;

    x = Some(42);
    expectTypeOf(x.ok_or("Not found")).toEqualTypeOf<Result<number, string>>;

    x = None;
    expectTypeOf(x.ok_or("Not found")).toEqualTypeOf<Result<number, string>>;
  });

  test("or", () => {
    let x: Option<number>;
    let y: Option<number>;

    x = Some(2);
    y = None;
    expectTypeOf(x.or(y)).toEqualTypeOf<Option<number>>;

    x = None;
    y = Some(100);
    expectTypeOf(x.or(y)).toEqualTypeOf<Option<number>>;

    x = Some(2);
    y = Some(100);
    expectTypeOf(x.or(y)).toEqualTypeOf<Option<number>>;

    x = None;
    y = None;
    expectTypeOf(x.or(y)).toEqualTypeOf<Option<number>>;
  });

  test("or_else", () => {
    let x: Option<string>;
    let y: Option<string>;

    x = Some("barbarians");
    y = Some("vikings");
    expectTypeOf(x.or_else(() => y)).toEqualTypeOf<Option<string>>;

    x = None;
    y = Some("vikings");
    expectTypeOf(x.or_else(() => y)).toEqualTypeOf<Option<string>>;

    x = None;
    y = None;
    expectTypeOf(x.or_else(() => y)).toEqualTypeOf<Option<string>>;
  });

  test("toString", () => {
    let x: Option<unknown>;

    x = Some(true);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Some(42);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Some("hello");
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Some([1, 2]);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Some({});
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = None;
    expectTypeOf(x.toString()).toEqualTypeOf<string>;
  });

  test("unwrap", () => {
    let x: Option<string>;

    x = Some("air");
    expectTypeOf(x.unwrap()).toEqualTypeOf<string>;
  });

  test("unwrap_or", () => {
    let x: Option<number>;

    x = Some(42);
    expectTypeOf(x.unwrap_or(1)).toEqualTypeOf<number>;

    x = None;
    expectTypeOf(x.unwrap_or(1)).toEqualTypeOf<number>;
  });

  test("unwrap_or_else", () => {
    const k = 10;
    let x: Option<number>;

    x = Some(4);
    expectTypeOf(x.unwrap_or_else(() => 2 * k)).toEqualTypeOf<number>;

    x = None;
    expectTypeOf(x.unwrap_or_else(() => 2 * k)).toEqualTypeOf<number>;
  });

  test("xor", () => {
    let x: Option<number>;
    let y: Option<number>;

    x = Some(2);
    y = None;
    expectTypeOf(x.xor(y)).toEqualTypeOf<Option<number>>;

    x = None;
    y = Some(100);
    expectTypeOf(x.xor(y)).toEqualTypeOf<Option<number>>;

    x = Some(2);
    y = Some(100);
    expectTypeOf(x.xor(y)).toEqualTypeOf<Option<number>>;

    x = None;
    y = None;
    expectTypeOf(x.xor(y)).toEqualTypeOf<Option<number>>;
  });
});

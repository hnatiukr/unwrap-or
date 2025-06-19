import { describe, test, expectTypeOf } from "vitest";

import { Ok, Err, type Result } from "../src/result";

describe("Result", () => {
  test("and", () => {
    let x: Result<number, string>;
    let y: Result<string, string>;

    x = Ok(2);
    y = Err("late error");
    expectTypeOf(x.and(y)).toEqualTypeOf<Result<string | number, string>>;

    x = Err("early error");
    y = Ok("foo");
    expectTypeOf(x.and(y)).toEqualTypeOf<Result<string | number, string>>;

    x = Err("not a 2");
    y = Err("late error");
    expectTypeOf(x.and(y)).toEqualTypeOf<Result<string | number, string>>;

    x = Ok(2);
    y = Ok("different result type");
    expectTypeOf(x.and(y)).toEqualTypeOf<Result<string | number, string>>;
  });

  test("and_then", () => {
    let x: Result<number, string>;
    let y: Result<string, string>;

    x = Ok(2);
    y = Err("late error");
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<
      Result<string | number, string>
    >;

    x = Err("early error");
    y = Ok("foo");
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<
      Result<string | number, string>
    >;

    x = Err("not a 2");
    y = Err("late error");
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<
      Result<string | number, string>
    >;

    x = Ok(2);
    y = Ok("different result type");
    expectTypeOf(x.and_then(() => y)).toEqualTypeOf<
      Result<string | number, string>
    >;
  });

  test("expect", () => {
    let x: Result<number, string>;

    x = Ok(42);
    expectTypeOf(x.expect("should return number value")).toEqualTypeOf<number>;
  });

  test("expect_err", () => {
    let x: Result<number, string>;

    x = Err("unknown value");
    expectTypeOf(x.expect_err("should return unknown value"))
      .toEqualTypeOf<string>;
  });

  test("inspect", () => {
    function get<T>(arr: T[], idx: number): Result<T, string> {
      const item = arr.at(idx);
      return item !== undefined ? Ok(item) : Err("Not found");
    }

    const list = [1, 2, 3, 4, 5];

    let x: Result<number, string>;

    x = get(list, 1).inspect((_v) => console.log);
    expectTypeOf(x).toEqualTypeOf<Result<number, string>>;

    x = get(list, 9).inspect((_v) => console.log);
    expectTypeOf(x).toEqualTypeOf<Result<number, string>>;
  });

  test("is_err", () => {
    let x: Result<number, string>;

    x = Ok(42);
    expectTypeOf(x.is_err()).toEqualTypeOf<boolean>;

    x = Err("Not found");
    expectTypeOf(x.is_err()).toEqualTypeOf<boolean>;
  });

  test("is_err_and", () => {
    let x: Result<{ html: string }, { statusCode: number }>;

    x = Err({ statusCode: 500 });
    expectTypeOf(x.is_err_and((err) => err.statusCode === 404))
      .toEqualTypeOf<boolean>;

    x = Err({ statusCode: 404 });
    expectTypeOf(x.is_err_and((err) => err.statusCode === 404))
      .toEqualTypeOf<boolean>;

    x = Ok({ html: "value" });
    expectTypeOf(x.is_err_and((err) => err.statusCode === 404))
      .toEqualTypeOf<boolean>;
  });

  test("is_ok", () => {
    let x: Result<number, string>;

    x = Ok(42);
    expectTypeOf(x.is_ok()).toEqualTypeOf<boolean>;

    x = Err("Not found");
    expectTypeOf(x.is_ok()).toEqualTypeOf<boolean>;
  });

  test("is_ok_and", () => {
    let x: Result<number, string>;

    x = Ok(0);
    expectTypeOf(x.is_ok_and((value) => value > 10)).toEqualTypeOf<boolean>;

    x = Ok(42);
    expectTypeOf(x.is_ok_and((value) => value > 10)).toEqualTypeOf<boolean>;

    x = Err("Not found");
    expectTypeOf(x.is_ok_and((value) => value > 10)).toEqualTypeOf<boolean>;
  });

  test("map", () => {
    let x: Result<string, { statusCode: number }>;

    x = Ok("42");
    expectTypeOf(x.map((value) => Number.parseInt(value, 10))).toEqualTypeOf<
      Result<string | number, { statusCode: number }>
    >;

    x = Err({ statusCode: 404 });
    expectTypeOf(x.map((value) => Number.parseInt(value, 10))).toEqualTypeOf<
      Result<string | number, { statusCode: number }>
    >;
  });

  test("map_or", () => {
    let x: Result<string, string>;

    x = Ok("foo");
    expectTypeOf(x.map_or(42, (v) => v.length)).toEqualTypeOf<number>;

    x = Err("bar");
    expectTypeOf(x.map_or(42, (v) => v.length)).toEqualTypeOf<number>;
  });

  test("map_or_else", () => {
    const k = 21;
    let x: Result<string, string>;

    x = Ok("foo");
    expectTypeOf(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
    ).toEqualTypeOf<number>;

    x = Err("bar");
    expectTypeOf(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
    ).toEqualTypeOf<number>;
  });

  test("or", () => {
    let x: Result<number, string>;
    let y: Result<number, string>;

    x = Ok(2);
    y = Err("Not found");
    expectTypeOf(x.or(y)).toEqualTypeOf<Result<number, string>>;

    x = Err("Not found");
    y = Ok(100);
    expectTypeOf(x.or(y)).toEqualTypeOf<Result<number, string>>;

    x = Ok(2);
    y = Ok(100);
    expectTypeOf(x.or(y)).toEqualTypeOf<Result<number, string>>;

    x = Err("Not found");
    y = Err("Not found");
    expectTypeOf(x.or(y)).toEqualTypeOf<Result<number, string>>;
  });

  test("or_else", () => {
    let x: Result<string, { statusCode: number }>;
    let y: Result<string, { statusCode: number }>;

    x = Ok("barbarians");
    y = Ok("vikings");
    expectTypeOf(x.or_else(() => y)).toEqualTypeOf<
      Result<string, { statusCode: number }>
    >;

    x = Err({ statusCode: 404 });
    y = Ok("vikings");
    expectTypeOf(x.or_else(() => y)).toEqualTypeOf<
      Result<string, { statusCode: number }>
    >;

    x = Err({ statusCode: 404 });
    y = Err({ statusCode: 404 });
    expectTypeOf(x.or_else(() => y)).toEqualTypeOf<
      Result<string, { statusCode: number }>
    >;
  });

  test("toString", () => {
    let x: Result<unknown, unknown>;

    x = Ok(true);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Ok(42);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Ok("hello");
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Ok([1, 2]);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Ok({});
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Ok({});
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Err(true);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Err(42);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Err("hello");
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Err([1, 2]);
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Err({});
    expectTypeOf(x.toString()).toEqualTypeOf<string>;

    x = Err({});
    expectTypeOf(x.toString()).toEqualTypeOf<string>;
  });

  test("unwrap", () => {
    let x: Result<number, string>;

    x = Ok(42);
    expectTypeOf(x.unwrap()).toEqualTypeOf<number>;
  });

  test("unwrap_err", () => {
    let x: Result<number, string>;

    x = Err("Not found");
    expectTypeOf(x.unwrap_err()).toEqualTypeOf<string>;
  });

  test("unwrap_or", () => {
    let x: Result<number, string>;

    x = Ok(42);
    expectTypeOf(x.unwrap_or(0)).toEqualTypeOf<number>;

    x = Err("Not found");
    expectTypeOf(x.unwrap_or(0)).toEqualTypeOf<number>;
  });

  test("unwrap_or_else", () => {
    let x: Result<number, string>;

    x = Ok(42);
    expectTypeOf(x.unwrap_or_else((err) => err.length)).toEqualTypeOf<number>;

    x = Err("foo");
    expectTypeOf(x.unwrap_or_else((err) => err.length)).toEqualTypeOf<number>;
  });
});

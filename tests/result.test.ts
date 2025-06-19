import { describe, test, assert } from "vitest";

import { Ok, Err, Result } from "../src/result";

const assert_eq = assert.deepEqual;
const assert_err = assert.throw;

describe("Result", () => {
  test("and", () => {
    let x: Result<number, string>;
    let y: Result<string, string>;

    x = Ok(2);
    y = Err("late error");
    assert_eq!(x.and(y), Err("late error"));

    x = Err("early error");
    y = Ok("foo");
    assert_eq!(x.and(y), Err("early error"));

    x = Err("not a 2");
    y = Err("late error");
    assert_eq!(x.and(y), Err("not a 2"));

    x = Ok(2);
    y = Ok("different result type");
    assert_eq!(x.and(y), Ok("different result type"));
  });

  test("and_then", () => {
    let x: Result<number, string>;
    let y: Result<string, string>;

    x = Ok(2);
    y = Err("late error");
    assert_eq!(
      x.and_then(() => y),
      Err("late error"),
    );

    x = Err("early error");
    y = Ok("foo");
    assert_eq!(
      x.and_then(() => y),
      Err("early error"),
    );

    x = Err("not a 2");
    y = Err("late error");
    assert_eq!(
      x.and_then(() => y),
      Err("not a 2"),
    );

    x = Ok(2);
    y = Ok("different result type");
    assert_eq!(
      x.and_then(() => y),
      Ok("different result type"),
    );
  });

  test("expect", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_eq!(x.expect("should return 42"), 42);

    x = Err("unknown value");
    assert_err!(
      () => x.expect("should return 42"),
      Error,
      'should return 42: "unknown value"',
    );
  });

  test("expect_err", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_err!(
      () => x.expect_err("should return unknown error value"),
      Error,
      "should return unknown error value: 42",
    );

    x = Err("unknown error value");
    assert_eq!(
      x.expect_err("should return unknown error value"),
      "unknown error value",
    );
  });

  test("inspect", () => {
    function get<T>(arr: T[], idx: number): Result<T, string> {
      const item = arr.at(idx);
      return item !== undefined ? Ok(item) : Err("Not found");
    }

    const list = [1, 2, 3, 4, 5];

    let has_inspected = false;

    let x = get(list, 2).inspect((_v) => {
      has_inspected = true;
    });

    assert_eq!(x, Ok(3));
    assert_eq!(has_inspected, true);
  });

  test("inspect_err", () => {
    function get<T>(arr: T[], idx: number): Result<T, string> {
      const item = arr.at(idx);
      return item !== undefined ? Ok(item) : Err("Not found");
    }

    const list = [1, 2, 3, 4, 5];

    let has_inspected = false;

    let x = get(list, 9).inspect_err((_e) => {
      has_inspected = true;
    });

    assert_eq!(x, Err("Not found"));
    assert_eq!(has_inspected, true);
  });

  test("is_err", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_eq!(x.is_err(), false);

    x = Err("Not found");
    assert_eq!(x.is_err(), true);
  });

  test("is_err_and", () => {
    let x: Result<{ html: string }, { statusCode: number }>;

    x = Err({ statusCode: 500 });
    assert_eq!(
      x.is_err_and((err) => err.statusCode === 404),
      false,
    );

    x = Err({ statusCode: 404 });
    assert_eq!(
      x.is_err_and((err) => err.statusCode === 404),
      true,
    );

    x = Ok({ html: "value" });
    assert_eq!(
      x.is_err_and((err) => err.statusCode === 404),
      false,
    );
  });

  test("is_ok", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_eq!(x.is_ok(), true);

    x = Err("Not found");
    assert_eq!(x.is_ok(), false);
  });

  test("is_ok_and", () => {
    let x: Result<number, string>;

    x = Ok(0);
    assert_eq!(
      x.is_ok_and((value) => value > 10),
      false,
    );

    x = Ok(42);
    assert_eq!(
      x.is_ok_and((value) => value > 10),
      true,
    );

    x = Err("Not found");
    assert_eq!(
      x.is_ok_and((value) => value > 10),
      false,
    );
  });

  test("map", () => {
    let x: Result<string, { statusCode: number }>;

    x = Ok("42");
    assert_eq!(
      x.map((value) => Number.parseInt(value, 10)),
      Ok(42),
    );

    x = Err({ statusCode: 404 });
    assert_eq!(
      x.map((value) => Number.parseInt(value, 10)),
      Err({ statusCode: 404 }),
    );
  });

  test("map_or", () => {
    let x: Result<string, string>;

    x = Ok("foo");
    assert_eq!(
      x.map_or(42, (v) => v.length),
      3,
    );

    x = Err("bar");
    assert_eq!(
      x.map_or(42, (v) => v.length),
      42,
    );
  });

  test("map_or_else", () => {
    const k = 21;
    let x: Result<string, string>;

    x = Ok("foo");
    assert_eq!(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
      3,
    );

    x = Err("bar");
    assert_eq!(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
      42,
    );
  });

  test("or", () => {
    let x: Result<number, string>;
    let y: Result<number, string>;

    x = Ok(2);
    y = Err("Not found");
    assert_eq!(x.or(y), Ok(2));

    x = Err("Not found");
    y = Ok(100);
    assert_eq!(x.or(y), Ok(100));

    x = Ok(2);
    y = Ok(100);
    assert_eq!(x.or(y), Ok(2));

    x = Err("Not found");
    y = Err("Not found");
    assert_eq!(x.or(y), Err("Not found"));
  });

  test("or_else", () => {
    let x: Result<string, { statusCode: number }>;
    let y: Result<string, { statusCode: number }>;

    x = Ok("barbarians");
    y = Ok("vikings");
    assert_eq!(
      x.or_else(() => y),
      Ok("barbarians"),
    );

    x = Err({ statusCode: 404 });
    y = Ok("vikings");
    assert_eq!(
      x.or_else(() => y),
      Ok("vikings"),
    );

    x = Err({ statusCode: 404 });
    y = Err({ statusCode: 404 });
    assert_eq!(
      x.or_else(() => y),
      Err({ statusCode: 404 }),
    );
  });

  test("toString", () => {
    let x: Result<unknown, unknown>;

    x = Ok(true);
    assert_eq!(x.toString(), "Ok(true)");

    x = Ok(42);
    assert_eq!(x.toString(), "Ok(42)");

    x = Ok("hello");
    assert_eq!(x.toString(), "Ok(hello)");

    x = Ok([1, 2]);
    assert_eq!(x.toString(), "Ok(1,2)");

    x = Ok({});
    assert_eq!(x.toString(), "Ok([object Object])");

    x = Ok(() => 2 * 4);
    assert_eq!(x.toString(), "Ok(() => 2 * 4)");

    x = Err(true);
    assert_eq!(x.toString(), "Err(true)");

    x = Err(42);
    assert_eq!(x.toString(), "Err(42)");

    x = Err("hello");
    assert_eq!(x.toString(), "Err(hello)");

    x = Err([1, 2]);
    assert_eq!(x.toString(), "Err(1,2)");

    x = Err({});
    assert_eq!(x.toString(), "Err([object Object])");

    x = Err(() => 2 * 4);
    assert_eq!(x.toString(), "Err(() => 2 * 4)");
  });

  test("unwrap", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_eq!(x.unwrap(), 42);

    x = Err("Not found");
    assert_err!(
      () => x.unwrap(),
      TypeError,
      "Called Result.unwrap() on an Err value",
    );
  });

  test("unwrap_err", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_err!(
      () => x.unwrap_err(),
      TypeError,
      "Called Result.unwrap_err() on an Ok value",
    );

    x = Err("Not found");
    assert_eq!(x.unwrap_err(), "Not found");
  });

  test("unwrap_or", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_eq!(x.unwrap_or(0), 42);

    x = Err("Not found");
    assert_eq!(x.unwrap_or(0), 0);
  });

  test("unwrap_or_else", () => {
    let x: Result<number, string>;

    x = Ok(42);
    assert_eq!(
      x.unwrap_or_else((err) => err.length),
      42,
    );

    x = Err("foo");
    assert_eq!(
      x.unwrap_or_else((err) => err.length),
      3,
    );
  });
});

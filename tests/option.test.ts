import { describe, test, assert } from "vitest";

import { Some, None, type Option } from "../src/option";

const assert_eq = assert.deepEqual;
const assert_err = assert.throw;

describe("Option", () => {
  test("and", () => {
    let x: Option<number>;
    let y: Option<string>;

    x = Some(2);
    y = None;
    assert_eq!(x.and(y), None);

    x = None;
    y = Some("foo");
    assert_eq!(x.and(y), None);

    x = Some(2);
    y = Some("foo");
    assert_eq!(x.and(y), Some("foo"));

    x = None;
    y = None;
    assert_eq!(x.and(y), None);
  });

  test("and_then", () => {
    let x: Option<string>;
    let y: Option<string>;

    x = Some("some value");
    y = None;
    assert_eq!(
      x.and_then(() => y),
      None,
    );

    x = None;
    y = Some("then value");
    assert_eq!(
      x.and_then(() => y),
      None,
    );

    x = Some("some value");
    y = Some("then value");
    assert_eq!(
      x.and_then(() => y),
      Some("then value"),
    );

    x = None;
    y = None;
    assert_eq!(
      x.and_then(() => y),
      None,
    );
  });

  test("expect", () => {
    let x: Option<string>;

    x = Some("value");
    assert_eq!(x.expect("should return string value"), "value");

    x = None;
    assert_err!(
      () => x.expect("should return string value"),
      Error,
      "should return string value",
    );
  });

  test("filter", () => {
    function is_even(n: number): boolean {
      return n % 2 == 0;
    }

    let x: Option<number>;

    x = None;
    assert_eq!(x.filter(is_even), None);

    x = Some(3);
    assert_eq!(x.filter(is_even), None);

    x = Some(4);
    assert_eq!(x.filter(is_even), Some(4));
  });

  test("flatten", () => {
    let x: Option<Option<number>>;

    x = Some(Some(6));
    assert_eq!(x.flatten(), Some(6));

    x = Some(None);
    assert_eq!(x.flatten(), None);

    x = None;
    assert_eq!(x.flatten(), None);
  });

  test("inspect", () => {
    function get<T>(arr: T[], idx: number): Option<T> {
      const item = arr.at(idx);
      return item !== undefined ? Some(item) : None;
    }

    const list = [1, 2, 3, 4, 5];

    let has_inspected = false;

    let x = get(list, 2).inspect((_v) => {
      has_inspected = true;
    });

    assert_eq!(x, Some(3));
    assert_eq!(has_inspected, true);
  });

  test("is_none", () => {
    let x: Option<number>;

    x = Some(2);
    assert_eq!(x.is_none(), false);

    x = None;
    assert_eq!(x.is_none(), true);
  });

  test("is_none_or", () => {
    let x: Option<number>;

    x = Some(2);
    assert_eq!(
      x.is_none_or((v) => v > 1),
      true,
    );

    x = Some(0);
    assert_eq!(
      x.is_none_or((v) => v > 1),
      false,
    );

    x = None;
    assert_eq!(
      x.is_none_or((v) => v > 1),
      true,
    );
  });

  test("is_some", () => {
    let x: Option<number>;

    x = Some(2);
    assert_eq!(x.is_some(), true);

    x = None;
    assert_eq!(x.is_some(), false);
  });

  test("is_some_and", () => {
    let x: Option<number>;

    x = Some(2);
    assert_eq!(
      x.is_some_and((v) => v > 1),
      true,
    );

    x = Some(0);
    assert_eq!(
      x.is_some_and((v) => v > 1),
      false,
    );

    x = None;
    assert_eq!(
      x.is_some_and((v) => v > 1),
      false,
    );
  });

  test("map", () => {
    let x: Option<string>;

    x = Some("Hello, World!");
    assert_eq!(
      x.map((s) => s.length),
      Some(13),
    );

    x = None;
    assert_eq!(
      x.map((s) => s.length),
      None,
    );
  });

  test("map_or", () => {
    let x: Option<string>;

    x = Some("foo");
    assert_eq!(
      x.map_or(42, (v) => v.length),
      3,
    );

    x = None;
    assert_eq!(
      x.map_or(42, (v) => v.length),
      42,
    );
  });

  test("map_or_else", () => {
    const k = 21;
    let x: Option<string>;

    x = Some("foo");
    assert_eq!(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
      3,
    );

    x = None;
    assert_eq!(
      x.map_or_else(
        () => 2 * k,
        (v) => v.length,
      ),
      42,
    );
  });

  test("or", () => {
    let x: Option<number>;
    let y: Option<number>;

    x = Some(2);
    y = None;
    assert_eq!(x.or(y), Some(2));

    x = None;
    y = Some(100);
    assert_eq!(x.or(y), Some(100));

    x = Some(2);
    y = Some(100);
    assert_eq!(x.or(y), Some(2));

    x = None;
    y = None;
    assert_eq!(x.or(y), None);
  });

  test("or_else", () => {
    let x: Option<string>;
    let y: Option<string>;

    x = Some("barbarians");
    y = Some("vikings");
    assert_eq!(
      x.or_else(() => y),
      Some("barbarians"),
    );

    x = None;
    y = Some("vikings");
    assert_eq!(
      x.or_else(() => y),
      Some("vikings"),
    );

    x = None;
    y = None;
    assert_eq!(
      x.or_else(() => y),
      None,
    );
  });

  test("toString", () => {
    let x: Option<unknown>;

    x = Some(true);
    assert_eq!(x.toString(), "Some(true)");

    x = Some(42);
    assert_eq!(x.toString(), "Some(42)");

    x = Some("hello");
    assert_eq!(x.toString(), "Some(hello)");

    x = Some([1, 2]);
    assert_eq!(x.toString(), "Some(1,2)");

    x = Some({});
    assert_eq!(x.toString(), "Some([object Object])");

    x = Some(() => 2 * 4);
    assert_eq!(x.toString(), "Some(() => 2 * 4)");

    x = None;
    assert_eq!(x.toString(), "None");
  });

  test("unwrap", () => {
    let x: Option<string>;

    x = Some("air");
    assert_eq!(x.unwrap(), "air");

    x = None;
    assert_err!(
      () => x.unwrap(),
      TypeError,
      "Called Option.unwrap() on a None value",
    );
  });

  test("unwrap_or", () => {
    let x: Option<number>;

    x = Some(42);
    assert_eq!(x.unwrap_or(1), 42);

    x = None;
    assert_eq!(x.unwrap_or(1), 1);
  });

  test("unwrap_or_else", () => {
    const k = 10;
    let x: Option<number>;

    x = Some(4);
    assert_eq!(
      x.unwrap_or_else(() => 2 * k),
      4,
    );

    x = None;
    assert_eq!(
      x.unwrap_or_else(() => 2 * k),
      20,
    );
  });

  test("xor", () => {
    let x: Option<number>;
    let y: Option<number>;

    x = Some(2);
    y = None;
    assert_eq!(x.xor(y), Some(2));

    x = None;
    y = Some(100);
    assert_eq!(x.xor(y), Some(100));

    x = Some(2);
    y = Some(100);
    assert_eq!(x.xor(y), None);

    x = None;
    y = None;
    assert_eq!(x.xor(y), None);
  });
});

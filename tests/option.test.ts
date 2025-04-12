import { test, assert } from "vitest";

import { Some, None, type Option } from "../src/option";

const assert_eq = assert.deepEqual;
const assert_err = assert.throw;

test("Option :: and", () => {
  let x: Option<number>;
  let y: Option<string>;

  x = Some(2);
  y = None;
  assert_eq!(x.and(y), y);

  x = None;
  y = Some("foo");
  assert_eq!(x.and(y), x);

  x = Some(2);
  y = Some("foo");
  assert_eq!(x.and(y), y);

  x = None;
  y = None;
  assert_eq!(x.and(y), x);
});

test("Option :: and_then", () => {
  let x: Option<string>;
  let y: Option<string>;

  x = Some("some value");
  y = None;
  assert_eq!(
    x.and_then(() => y),
    y,
  );

  x = None;
  y = Some("then value");
  assert_eq!(
    x.and_then(() => y),
    x,
  );

  x = Some("some value");
  y = Some("then value");
  assert_eq!(
    x.and_then(() => y),
    y,
  );

  x = None;
  y = None;
  assert_eq!(
    x.and_then(() => y),
    x,
  );
});

test("Option :: expect", () => {
  let x: Option<string>;

  x = Some("value");
  assert_eq!(x.expect("should rerurn string value"), "value");

  x = None;
  assert_err!(() => x.expect("should rerurn string value"), Error);
});

test("Option :: filter", () => {
  function is_even(n: number): boolean {
    return n % 2 == 0;
  }

  assert_eq!(None.filter(is_even), None);
  assert_eq!(Some(3).filter(is_even), None);
  assert_eq!(Some(4).filter(is_even), Some(4));
});

test("Option :: inspect", () => {
  function get<T>(arr: T[], idx: number): Option<T> {
    const item = arr.at(idx);
    return item !== undefined ? Some(item) : None;
  }

  const list = [1, 2, 3, 4, 5];

  const x = get(list, 1)
    .inspect((_v) => console.log)
    .expect("list should be long enough");

  assert_eq!(x, 2);
});

test("Option :: is_none", () => {
  let x: Option<number>;

  x = Some(2);
  assert_eq!(x.is_none(), false);

  x = None;
  assert_eq!(x.is_none(), true);
});

test("Option :: is_none_or", () => {
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

test("Option :: is_some", () => {
  let x: Option<number>;

  x = Some(2);
  assert_eq!(x.is_some(), true);

  x = None;
  assert_eq!(x.is_some(), false);
});

test("Option :: is_some_and", () => {
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

test("Option :: map", () => {
  let x: Option<string>;

  x = Some("Hello, World!");
  assert_eq!(
    x.map((s) => s.length),
    Some(13),
  );

  x = None;
  assert_eq!(
    // @ts-expect-error: option is known to be None; safe to ignore.
    x.map((s) => s.length),
    None,
  );
});

test("Option :: map_or", () => {
  let x: Option<string>;

  x = Some("foo");
  assert_eq!(
    x.map_or(42, (v) => v.length),
    3,
  );

  x = None;
  assert_eq!(
    // @ts-expect-error: option is known to be None; safe to ignore.
    x.map_or(42, (v) => v.length),
    42,
  );
});

test("Option :: map_or_else", () => {
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
      // @ts-expect-error: option is known to be None; safe to ignore.
      (v) => v.length,
    ),
    42,
  );
});

test("Option :: or", () => {
  let x: Option<number>;
  let y: Option<number>;

  x = Some(2);
  y = None;
  assert_eq!(x.or(y), x);

  x = None;
  y = Some(100);
  assert_eq!(x.or(y), y);

  x = Some(2);
  y = Some(100);
  assert_eq!(x.or(y), x);

  x = None;
  y = None;
  assert_eq!(x.or(y), x);
});

test("Option :: or_else", () => {
  let x: Option<string>;
  let y: Option<string>;

  x = Some("barbarians");
  y = Some("vikings");
  assert_eq!(
    x.or_else(() => y),
    x,
  );

  x = None;
  y = Some("vikings");
  assert_eq!(
    x.or_else(() => y),
    y,
  );

  x = None;
  y = None;
  assert_eq!(
    x.or_else(() => y),
    x,
  );
});

test("Option :: toString", () => {
  let x: Option<unknown>;

  x = Some(true);
  assert_eq!(x.toString(), "Some(true)");

  x = Some(42);
  assert_eq!(x.toString(), "Some(42)");

  x = Some("hello");
  assert_eq!(x.toString(), 'Some("hello")');

  x = Some([1, 2]);
  assert_eq!(x.toString(), "Some([1, 2])");

  x = Some({});
  assert_eq!(x.toString(), "Some([object Object])");

  x = None;
  assert_eq!(x.toString(), "None");
});

test("Option :: unwrap", () => {
  let x: Option<string>;

  x = Some("air");
  assert_eq!(x.unwrap(), "air");

  x = None;
  assert_err!(() => x.unwrap(), TypeError);
});

test("Option :: unwrap_or", () => {
  let x: Option<number>;

  x = Some(42);
  assert_eq!(x.unwrap_or(1), 42);

  x = None;
  assert_eq!(x.unwrap_or(1), 1);
});

test("Option :: unwrap_or_else", () => {
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

test("Option :: xor", () => {
  let x: Option<number>;
  let y: Option<number>;

  x = Some(2);
  y = None;
  assert_eq!(x.xor(y), x);

  x = None;
  y = Some(100);
  assert_eq!(x.xor(y), y);

  x = Some(2);
  y = Some(100);
  assert_eq!(x.xor(y), None);

  x = None;
  y = None;
  assert_eq!(x.xor(y), y);
});

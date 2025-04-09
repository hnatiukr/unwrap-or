import { assertEquals, assertThrows } from "@std/assert";

import { None, Some } from "../src/option/index.ts";
import type { Option } from "../src/option/index.ts";

Deno.test("Option :: and", () => {
  let x: Option<number>;
  let y: Option<string>;

  x = Some(2);
  y = None;
  assertEquals(x.and(y), y);

  x = None;
  y = Some("foo");
  assertEquals(x.and(y), x);

  x = Some(2);
  y = Some("foo");
  assertEquals(x.and(y), y);

  x = None;
  y = None;
  assertEquals(x.and(y), x);
});

Deno.test("Option :: and_then", () => {
  let x: Option<string>;
  let y: Option<string>;

  x = Some("some value");
  y = None;
  assertEquals(x.and_then(() => y), y);

  x = None;
  y = Some("then value");
  assertEquals(x.and_then(() => y), x);

  x = Some("some value");
  y = Some("then value");
  assertEquals(x.and_then(() => y), y);

  x = None;
  y = None;
  assertEquals(x.and_then(() => y), x);
});

Deno.test("Option :: expect", () => {
  let x: Option<string>;

  x = Some("value");
  assertEquals(x.expect("should rerurn string value"), "value");

  x = None;
  assertThrows(() => x.expect("should rerurn string value"), Error);
});

Deno.test("Option :: filter", () => {
  function is_even(n: number): boolean {
    return n % 2 == 0;
  }

  assertEquals(None.filter(is_even), None);
  assertEquals(Some(3).filter(is_even), None);
  assertEquals(Some(4).filter(is_even), Some(4));
});

Deno.test("Option :: inspect", () => {
  function get<T>(arr: T[], idx: number): Option<T> {
    const item = arr.at(idx);
    return item !== undefined ? Some(item) : None;
  }

  const list = [1, 2, 3, 4, 5];

  const x = get(list, 1)
    .inspect((_v) => console.log)
    .expect("list should be long enough");

  assertEquals(x, 2);
});

Deno.test("Option :: is_none", () => {
  let x: Option<number>;

  x = Some(2);
  assertEquals(x.is_none(), false);

  x = None;
  assertEquals(x.is_none(), true);
});

Deno.test("Option :: is_none_or", () => {
  let x: Option<number>;

  x = Some(2);
  assertEquals(x.is_none_or((v) => v > 1), true);

  x = Some(0);
  assertEquals(x.is_none_or((v) => v > 1), false);

  x = None;
  assertEquals(x.is_none_or((v) => v > 1), true);
});

Deno.test("Option :: is_some", () => {
  let x: Option<number>;

  x = Some(2);
  assertEquals(x.is_some(), true);

  x = None;
  assertEquals(x.is_some(), false);
});

Deno.test("Option :: is_some_and", () => {
  let x: Option<number>;

  x = Some(2);
  assertEquals(x.is_some_and((v) => v > 1), true);

  x = Some(0);
  assertEquals(x.is_some_and((v) => v > 1), true);

  x = None;
  assertEquals(x.is_some_and((v) => v > 1), false);
});

Deno.test("Option :: map", () => {
  let x: Option<string>;

  x = Some("Hello, World!");
  assertEquals(x.map((s) => s.length), Some(13));

  x = None;
  assertEquals(x.map((s) => s.length), None);
});

Deno.test("Option :: map_or", () => {
  let x: Option<string>;

  x = Some("foo");
  assertEquals(x.map_or(42, (v) => v.length), 3);

  x = None;
  assertEquals(x.map_or(42, (v) => v.length), 42);
});

Deno.test("Option :: map_or_else", () => {
  const k = 21;
  let x: Option<string>;

  x = Some("foo");
  assertEquals(x.map_or_else(() => 2 * k, (v) => v.length), 3);

  x = None;
  assertEquals(x.map_or_else(() => 2 * k, (v) => v.length), 42);
});

Deno.test("Option :: or", () => {
  let x: Option<number>;
  let y: Option<number>;

  x = Some(2);
  y = None;
  assertEquals(x.or(y), x);

  x = None;
  y = Some(100);
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.or(y), y);

  x = Some(2);
  y = Some(100);
  assertEquals(x.or(y), x);

  x = None;
  y = None;
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.or(y), x);
});

Deno.test("Option :: or_else", () => {
  let x: Option<string>;
  let y: Option<string>;

  x = Some("barbarians");
  y = Some("vikings");
  assertEquals(x.or_else(() => y), x);

  x = None;
  y = Some("vikings");
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or_else' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.or_else(() => y), y);

  x = None;
  y = None;
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or_else' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.or_else(() => y), x);
});

Deno.test("Option :: toString", () => {
  let x: Option<unknown>;

  x = Some(true);
  assertEquals(x.toString(), "Some(true)");

  x = Some(42);
  assertEquals(x.toString(), "Some(42)");

  x = Some("hello");
  assertEquals(x.toString(), 'Some("hello")');

  x = Some([1, 2]);
  assertEquals(x.toString(), "Some([1, 2])");

  x = Some({});
  assertEquals(x.toString(), "Some([object Object])");

  x = None;
  assertEquals(x.toString(), "None");
});

Deno.test("Option :: unwrap", () => {
  let x: Option<string>;

  x = Some("air");
  assertEquals(x.unwrap(), "air");

  x = None;
  assertThrows(() => x.unwrap(), TypeError);
});

Deno.test("Option :: unwrap_or", () => {
  let x: Option<number>;

  x = Some(42);
  assertEquals(x.unwrap_or(1), 42);

  x = None;
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.unwrap_or(1), 1);
});

Deno.test("Option :: unwrap_or", () => {
  const k = 10;
  let x: Option<number>;

  x = Some(4);
  assertEquals(x.unwrap_or_else(() => 2 * k), 4);

  x = None;
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or_else' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.unwrap_or_else(() => 2 * k), 20);
});

Deno.test("Option :: xor", () => {
  let x: Option<number>;
  let y: Option<number>;

  x = Some(2);
  y = None;
  assertEquals(x.xor(y), x);

  x = None;
  y = Some(100);
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.xor(y), y);

  x = Some(2);
  y = Some(100);
  assertEquals(x.xor(y), None);

  x = None;
  y = None;
  // @ts-expect-error: The 'option' is statically known to be 'None', so TypeScript can't see the 'or' as valid.
  // This code path is unreachable, but included for exhaustiveness or future-proofing.
  assertEquals(x.xor(y), y);
});

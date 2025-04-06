import { assertEquals, assertThrows } from "@std/assert";

import { None, type Option, Some } from "./index.ts";

Deno.test("Option: Some", () => {
  const value = 42;
  const option = Some(42);

  assertEquals(option.is_some(), true);
  assertEquals(option.is_none(), false);
  assertEquals(option.unwrap(), value);
  assertEquals(option.unwrap_or(100), value);
  assertEquals(option.unwrap_or_else(() => 100), value);
  assertEquals(option.expect("never panic"), value);
  assertEquals(option.is_some_and((x) => typeof x === "string"), false);
  assertEquals(option.map((x) => x * 100), value * 100);
  assertEquals(option.map_or((x) => x * 100, "never"), value * 100);
  assertEquals(option.filter((x) => x % 2 === 0), Some(value));
  assertEquals(option.toString(), "Some(42)");
});

Deno.test("Option: None", () => {
  const option = None;

  assertEquals(option.is_some(), false);
  assertEquals(option.is_none(), true);
  assertThrows(() => option.unwrap(), TypeError);
  assertEquals(option.unwrap_or("instant value"), "instant value");
  assertEquals(option.unwrap_or_else(() => "lazy value"), "lazy value");
  assertThrows(() => option.expect("expected panic message"), Error);
  assertEquals(option.is_some_and((x) => typeof x !== "string"), false);
  assertThrows(() => option.map((x) => x * 100), TypeError);
  assertEquals(option.map_or((x) => x * 100, "default value"), "default value");
  assertEquals(option.filter((x) => x % 2 === 0), None);
  assertEquals(option.toString(), "None");
});

Deno.test("Option: case 1", () => {
  interface User {
    id: number;
    name: string;
    email: string;
    premium?: boolean;
  }

  const users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", premium: true },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com", premium: true },
  ];

  function findUserById(id: number) {
    const user = users.find((user) => user.id === id);
    return user ? Some(user) : None;
  }

  function getPremiumDiscount(user: User): number {
    return user.premium ? 20 : 0;
  }

  // 1

  const existingUser = findUserById(1);

  assertEquals(existingUser.is_some(), true);
  assertEquals(existingUser.unwrap().name, "Alice");
  assertEquals(existingUser.is_some_and((user) => user.premium === true), true);
  assertEquals(existingUser.map((user) => user.premium), true);
  assertEquals(existingUser.map_or((user) => getPremiumDiscount(user), 0), 20);
  assertEquals(
    existingUser.filter((user) => user.premium === true).is_some(),
    true,
  );
  assertEquals(
    existingUser.filter((user) => user.premium === false).is_none(),
    true,
  );

  // 2

  const nonExistingUser = findUserById(99);

  assertEquals(nonExistingUser.is_none(), true);
  assertThrows(() => nonExistingUser.unwrap(), TypeError);
  assertEquals(
    nonExistingUser.unwrap_or({
      id: 0,
      name: "Guest",
      email: "guest@example.com",
    }).name,
    "Guest",
  );
  assertEquals(
    nonExistingUser.map_or((user) => getPremiumDiscount(user), 0),
    0,
  );

  // 3

  function getWelcomeMessage(userId: number): string {
    return findUserById(userId)
      .map_or(
        (user) =>
          `Welcome back, ${user.name}${user.premium ? " (Premium)" : ""}!`,
        "User not found",
      );
  }

  assertEquals(getWelcomeMessage(1), "Welcome back, Alice (Premium)!");
  assertEquals(getWelcomeMessage(2), "Welcome back, Bob!");
  assertEquals(getWelcomeMessage(99), "User not found");

  // 4

  function getPremiumUserEmail(userId: number) {
    return findUserById(userId)
      .filter((user) => user.premium === true)
      .map_or((user) => user.email, null);
  }

  assertEquals(getPremiumUserEmail(1), "alice@example.com");
  assertEquals(getPremiumUserEmail(2), null);
  assertEquals(getPremiumUserEmail(99), null);

  // 5

  function getUserNameOrGenerate(userId: number): string {
    return findUserById(userId)
      .unwrap_or_else(() => {
        return {
          id: userId,
          name: `User${userId}`,
          email: `user${userId}@example.com`,
        };
      })
      .name;
  }

  assertEquals(getUserNameOrGenerate(1), "Alice");
  assertEquals(getUserNameOrGenerate(99), "User99");

  // 6

  try {
    findUserById(99).expect("Critical user not found!");
  } catch (e) {
    assertEquals(
      (e as { message?: string }).message,
      "Critical user not found!",
    );
  }
});

Deno.test("Option: case 2", () => {
  interface FormField {
    value: string;
    required: boolean;
  }

  function validateValue(field: FormField) {
    if (field.required && !field.value.trim()) {
      return None;
    }

    return Some(field.value);
  }

  const validRequiredField = validateValue({ value: "test", required: true });
  const invalidRequiredField = validateValue({ value: "", required: true });
  const validOptionalField = validateValue({ value: "", required: false });

  assertEquals(validRequiredField.is_some(), true);
  assertEquals(invalidRequiredField.is_some(), false);
  assertEquals(validOptionalField.is_some(), true);

  const formValues = {
    name: validateValue({ value: "John", required: true }),
    email: validateValue({ value: "john@example.com", required: true }),
    phone: validateValue({ value: "", required: false }),
  };

  const isFormValid = Object
    .values(formValues)
    .every((field) => field.is_some());

  assertEquals(isFormValid, true);

  function collectErrorMessages<T>(form: Record<string, Option<T>>) {
    return Object.entries(form)
      .filter(([_, value]) => value.is_none())
      .map(([key, _]) => `${key} is required`);
  }

  const invalidForm = {
    name: validateValue({ value: "John", required: true }),
    email: validateValue({ value: "", required: true }),
    address: validateValue({ value: "", required: true }),
  };

  const errors = collectErrorMessages(invalidForm);

  assertEquals(errors.length, 2);
  assertEquals(errors.includes("email is required"), true);
  assertEquals(errors.includes("address is required"), true);
});

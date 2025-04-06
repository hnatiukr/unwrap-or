/**
 * `Option` type module - provides a type-safe alternative to `null` or `undefined`
 *
 * The `Option` type represents an optional value: every `Option` is either `Some` and contains a value,
 * or `None`, and does not. This module provides a more expressive and safer way to handle
 * potentially missing values compared to `null`/`undefined`.
 *
 * @module Option
 */

import { Some as SomeConstructor } from "./option.ts";
import { None as NoneConstructor } from "./option.ts";

/**
 * Type representing the absence of a value
 */
export type None = NoneConstructor;

/**
 * Type representing the presence of a value
 */
export type Some<T> = SomeConstructor<T>;

/**
 * Union type representing either the presence (`Some`) or absence (`None`) of a value
 */
export type Option<T> = Some<T> | None;

/**
 * Function - constructor representing the presence of a value
 *
 * @example
 * // 1
 * const user = database.lookup(id)
 * const optionUser = user ? Some(user) : None
 *
 * // 2
 * const randomInt = Math.floor(Math.random() * 100)
 * const optionInt = random > 50 ? Some(randomInt) : None
 */
export function Some<T>(value: T): Some<T> {
  return new SomeConstructor<T>(value);
}

/**
 * Function - constructor representing the absence of a value
 *
 * @example
 * // 1
 * const user = database.lookup(id)
 * const optionUser = user ? Some(user) : None
 *
 * // 2
 * const randomInt = Math.floor(Math.random() * 100)
 * const optionInt = random > 50 ? Some(randomInt) : None
 */
export const None: None = new NoneConstructor();

/**
 * Type guard that checks if an `Option` is a `Some`.
 *
 * This function acts as a TypeScript type guard, allowing the compiler to narrow the type
 * in conditional branches. When this function returns `true`, TypeScript will understand
 * that the option is specifically a `Some<T>` rather than an `Option<T>`, enabling direct
 * access to Some-specific methods without additional type assertions.
 *
 * @example
 * // The option type is initially Option<number>*
 * const option = Math.random() > 0.5 ? Some(42) : None
 *
 * if (is_some(option)) {
 *   // TypeScript has narrowed the type to Some<number>
 *   const value = option.unwrap() // Safe to call unwrap, TypeScript knows this is Some
 *   console.log(value * 2) // TypeScript knows 'value' is a number
 * } else {
 *   // TypeScript has narrowed the type to None
 *   console.log(option.is_none()) // Always true, TypeScript knows this is None
 * }
 *
 * // Using with higher-order functions
 * const maybeNumbers: Option<number>[] = [Some(1), None, Some(3)]
 * const numbers = maybeNumbers
 *   .filter(is_some) // Type guard narrows the filtered array to Some<number>[]
 *   .map(option => option.unwrap()) // Safe to unwrap, TypeScript knows these are all Some
 */
export function is_some<T>(option: Option<T>): boolean {
  return option instanceof SomeConstructor;
}

/**
 * Type guard that checks if an `Option` is a `None`.
 *
 * This function acts as a TypeScript type guard, allowing the compiler to narrow the type
 * in conditional branches. When this function returns `true`, TypeScript will understand
 * that the option is specifically a None rather than an `Option<T>`, enabling direct
 * access to None-specific behavior without additional type assertions.
 *
 * @example
 * // The option type is initially Option<string>
 * const option = fetchUserName() // Option<string>
 *
 * if (is_none(option)) {
 *   // TypeScript has narrowed the type to None
 *   console.log("User name not available")
 *   showDefaultUI()
 * } else {
 *   // TypeScript has narrowed the type to Some<string>
 *   const name = option.unwrap() // Safe, TypeScript knows this can't be None
 *   displayUserName(name)
 * }
 *
 * // Error handling pattern
 * try {
 *   const result = performOperation()
 *   if (is_none(result)) {
 *     // TypeScript knows 'result' is None here
 *     throw new Error("Operation failed with no result")
 *   }
 *
 *   // TypeScript knows 'result' is Some<ResultType> here
 *   processResult(result.unwrap())
 * } catch (error) {
 *   handleError(error)
 * }
 */
export function is_none<T>(option: Option<T>): boolean {
  return option instanceof NoneConstructor;
}

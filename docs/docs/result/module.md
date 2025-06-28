---
id: result
slug: /result
title: Module Result
sidebar_label: Module
sidebar_position: 1
---

Error handling with the `Result` type.

`Result<T, E>` is the type used for returning and propagating errors. There are variants, `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error and containing an error value.

```
Result<T, E> {
   Ok(T),
   Err(E),
}
```

Functions return `Result` whenever errors are expected and recoverable. Commonly, `Result` is most prominently used for I/O.

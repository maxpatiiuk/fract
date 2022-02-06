# Fract (Fake-React)

A hobby project that tries to recreate React from scratch.

Accent is made on maintaining compatability between the APIs while also adding
additional strictness and removing legacy features.

[Demo](./demo/)

```yaml
NOTE:
This project is not intended for production use.
It is not tested and has no performance optimizations.
```

## Features

### Things Fract can do:

- Functional components
- First-class TypeScript support
- useState, useEffect, useCallback, useRef and useMemo hooks
- User-defined hooks (including nested hooks)
- Support for rules-of-hooks ESLint rules
- Chaining multiple state updates together
- Event listeners
- Strict mode (always ON)
  - Fract does not show warnings. It throws an exception immediately, making
    sure bugs get discovered quicker.
  - APIs don't have default values. All arguments must explicitly provided.

### Things Fract can't do (yet):

- **ReRendering**
- **Props**
- **Nested components**
- JSX
- Context
- Portals
- Error boundaries
- Performance optimizations
- DevTools integration
- Run-time validation of intrinsic elements' attributes

(Items in bold are top priority)

### Things Fract would never support:

- Class components
- Legacy React features

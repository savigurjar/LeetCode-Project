

# 📘 React Hooks - Easy Guide with Explanations

React Hooks let you use **state, lifecycle methods, and other React features** in **functional components** (without writing classes).

---

## 🔑 Common Hooks

### 1. `useState`

📌 **Definition:** Lets you add state (data that can change) to a functional component.

✅ **Example:**

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // state variable with initial value 0

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

📝 **Explanation:**

* `count` → current state value.
* `setCount` → function to update state.
* State changes re-render the component.

---

### 2. `useEffect`

📌 **Definition:** Runs side effects in a component (e.g., API calls, event listeners, timers).

✅ **Example:**

```jsx
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://api.example.com/data")
      .then(res => res.json())
      .then(setData);
  }, []); // runs once after component mounts

  return <div>{data ? data.name : "Loading..."}</div>;
}
```

📝 **Explanation:**

* Runs after rendering by default.
* `[]` dependency array → run only once.
* `[variable]` → run when that variable changes.

---

### 3. `useContext`

📌 **Definition:** Allows you to share data between components without passing props manually.

✅ **Example:**

```jsx
import { useContext, createContext } from "react";

const ThemeContext = createContext("light");

function Child() {
  const theme = useContext(ThemeContext);
  return <p>Theme is {theme}</p>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}
```

📝 **Explanation:**

* `createContext` creates a context object.
* `Provider` supplies the value.
* `useContext` consumes the value directly.

---

### 4. `useRef`

📌 **Definition:** Stores a mutable reference (like a box) that doesn’t cause re-renders when changed.

✅ **Example:**

```jsx
import { useRef } from "react";

function InputFocus() {
  const inputRef = useRef();

  const focus = () => inputRef.current.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focus}>Focus Input</button>
    </>
  );
}
```

📝 **Explanation:**

* Commonly used for DOM elements (like focusing input).
* Can also store values across renders without state.

---

### 5. `useMemo`

📌 **Definition:** Memoizes (caches) the result of a calculation to avoid re-computation.

✅ **Example:**

```jsx
import { useMemo } from "react";

function ExpensiveCalc({ num }) {
  const result = useMemo(() => {
    console.log("Calculating...");
    return num * 1000;
  }, [num]);

  return <p>Result: {result}</p>;
}
```

📝 **Explanation:**

* Runs the function only when dependencies change.
* Useful for performance optimization.

---

### 6. `useCallback`

📌 **Definition:** Memoizes a function so it isn’t recreated on every render.

✅ **Example:**

```jsx
import { useCallback, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount(c => c + 1), []);

  return <button onClick={increment}>Count: {count}</button>;
}
```

📝 **Explanation:**

* Useful when passing functions to child components.
* Prevents unnecessary re-renders.

---

### 7. `useReducer`

📌 **Definition:** An alternative to `useState`, good for managing complex state logic.

✅ **Example:**

```jsx
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "dec": return { count: state.count - 1 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <button onClick={() => dispatch({ type: "dec" })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: "inc" })}>+</button>
    </>
  );
}
```

📝 **Explanation:**

* Works like Redux reducer.
* Useful for multiple related state updates.

---

## ⚡ Less Common Hooks

* **`useLayoutEffect`** → Like `useEffect`, but runs synchronously *before painting the screen*.
* **`useImperativeHandle`** → Lets you customize the `ref` exposed by a component.
* **`useDebugValue`** → Displays debug info for custom hooks in React DevTools.
* **`useTransition`** → Marks state updates as low priority (for smoother UI).
* **`useDeferredValue`** → Defers a value until less busy rendering time.
* **`useId`** → Generates unique, stable IDs for accessibility.

---

## 📌 Rules of Hooks

1. Only call hooks **at the top level** (not inside loops, conditions, or nested functions).
2. Only call hooks **from React functions** (functional components or custom hooks).

---


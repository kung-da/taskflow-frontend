// src/context/TodoContext.jsx
// Global context that wraps useTodos() and makes its values available
// to any component in the tree without prop drilling.
// Components should consume this via useTodoContext().

import React, { createContext, useContext } from 'react';
import { useTodos } from '../hooks/useTodos.js';

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const todos = useTodos();
  return <TodoContext.Provider value={todos}>{children}</TodoContext.Provider>;
}

/**
 * Access the todo context. Must be used within a <TodoProvider>.
 * @returns {ReturnType<import('../hooks/useTodos.js').useTodos>}
 */
export function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return ctx;
}

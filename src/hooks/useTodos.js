// src/hooks/useTodos.js
// Central hook that manages all todo state and API interactions.
// Components remain purely presentational — they just call these actions.
// Implements optimistic updates for toggle and delete for instant UX feedback.

import { useState, useCallback, useEffect } from 'react';
import * as todoApi from '../api/todoApi.js';
import { useDebounce } from './useDebounce.js';

/**
 * @returns {{
 *   todos: Array,
 *   loading: boolean,
 *   error: string|null,
 *   meta: object|null,
 *   search: string,
 *   setSearch: Function,
 *   filter: string,
 *   setFilter: Function,
 *   page: number,
 *   setPage: Function,
 *   addTodo: Function,
 *   editTodo: Function,
 *   removeTodo: Function,
 *   toggleTodo: Function,
 *   refetch: Function,
 * }}
 */
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await todoApi.getTodos({
        search: debouncedSearch || undefined,
        status: filter,
        page,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc',
      });
      setTodos(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err.message ?? 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter, page]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /** Create a new todo and re-fetch the list. */
  const addTodo = useCallback(async (data) => {
    const res = await todoApi.createTodo(data);
    // Re-fetch instead of manually inserting so pagination/sort stay consistent
    await fetchTodos();
    return res.data;
  }, [fetchTodos]);

  /** Update an existing todo and re-fetch. */
  const editTodo = useCallback(async (id, data) => {
    const res = await todoApi.updateTodo(id, data);
    await fetchTodos();
    return res.data;
  }, [fetchTodos]);

  /**
   * Optimistically toggle a todo's completed state.
   * Reverts if the API call fails.
   */
  const toggleTodo = useCallback(async (id) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
    );

    try {
      await todoApi.toggleTodo(id);
    } catch (err) {
      // Revert on failure
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
      );
      throw err;
    }
  }, []);

  /**
   * Optimistically remove a todo from the list.
   * Reverts if the API call fails.
   */
  const removeTodo = useCallback(async (id) => {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await todoApi.deleteTodo(id);
      // Update meta total
      setMeta((prev) => prev ? { ...prev, total: prev.total - 1 } : prev);
    } catch (err) {
      setTodos(snapshot);
      throw err;
    }
  }, [todos]);

  return {
    todos,
    loading,
    error,
    meta,
    search,
    setSearch,
    filter,
    setFilter,
    page,
    setPage,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
    refetch: fetchTodos,
  };
}

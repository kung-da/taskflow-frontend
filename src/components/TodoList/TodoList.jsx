// src/components/TodoList/TodoList.jsx
import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem.jsx';
import { EmptyState } from '../common/EmptyState.jsx';
import { Spinner } from '../common/Spinner.jsx';

/**
 * @param {{
 *   todos: Array,
 *   loading: boolean,
 *   error: string|null,
 *   search: string,
 *   filter: string,
 *   onToggle: Function,
 *   onEdit: Function,
 *   onDelete: Function,
 *   onClearFilters: Function,
 *   onRetry: Function,
 * }} props
 */
export function TodoList({
  todos,
  loading,
  error,
  search,
  filter,
  onToggle,
  onEdit,
  onDelete,
  onClearFilters,
  onRetry,
}) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400 dark:text-slate-500">Loading todos…</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-6 text-center animate-fade-in">
        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-3">{error}</p>
        <button
          onClick={onRetry}
          className="text-sm text-red-600 dark:text-red-400 underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty states
  if (todos.length === 0) {
    const isFiltered = search || filter !== 'all';
    return isFiltered ? (
      <EmptyState
        title="No todos match"
        description={`No results for your current search or filter.`}
        action={{ label: 'Clear filters', onClick: onClearFilters }}
      />
    ) : (
      <EmptyState
        title="Your list is empty"
        description="Add a todo above to get started!"
      />
    );
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Todo list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

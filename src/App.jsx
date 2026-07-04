// src/App.jsx
// Root component — wires the TodoProvider around the main layout.
// All child components access todo state via useTodoContext().

import React from 'react';
import { TodoProvider, useTodoContext } from './context/TodoContext.jsx';
import { TodoForm } from './components/TodoForm/TodoForm.jsx';
import { SearchBar } from './components/SearchBar/SearchBar.jsx';
import { FilterTabs } from './components/FilterTabs/FilterTabs.jsx';
import { TodoList } from './components/TodoList/TodoList.jsx';

function TodoPage() {
  const {
    todos,
    loading,
    error,
    meta,
    search,
    setSearch,
    filter,
    setFilter,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
    refetch,
  } = useTodoContext();

  const handleClearFilters = () => {
    setSearch('');
    setFilter('all');
  };

  const activeCount = todos.filter((t) => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-800">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
            Task<span className="text-primary-500">Flow</span>
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {meta?.total ?? 0} task{meta?.total !== 1 ? 's' : ''} · {activeCount} remaining
          </p>
        </header>

        {/* Create form */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-slate-100 dark:border-surface-700 p-4 mb-4">
          <TodoForm onSubmit={addTodo} autoFocus submitLabel="Add Task" />
        </div>

        {/* Search + Filter controls */}
        <div className="space-y-2 mb-4">
          <SearchBar value={search} onChange={setSearch} />
          <FilterTabs
            value={filter}
            onChange={setFilter}
          />
        </div>

        {/* Todo list */}
        <main>
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            search={search}
            filter={filter}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={removeTodo}
            onClearFilters={handleClearFilters}
            onRetry={refetch}
          />
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-300 dark:text-slate-600">
          Built with React + Express + Prisma
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <TodoPage />
    </TodoProvider>
  );
}

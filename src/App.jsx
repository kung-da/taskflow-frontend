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

  const activeCount = todos.filter((todo) => !todo.isCompleted).length;
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const totalCount = meta?.total ?? todos.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-surface-950 dark:text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-10">
        <aside className="lg:sticky lg:top-10 lg:h-fit">
          <header className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
              Todo workspace
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Task<span className="text-primary-600">Flow</span>
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Plan, track, and finish your daily work in one focused list.
            </p>
          </header>

          <section className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-700 dark:bg-surface-900">
            <div>
              <p className="text-2xl font-semibold">{totalCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{activeCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Done</p>
            </div>
          </section>
        </aside>

        <section className="min-w-0">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-surface-700 dark:bg-surface-900 sm:p-5">
            <TodoForm onSubmit={addTodo} autoFocus submitLabel="Add task" />
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-700 dark:bg-surface-900">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_360px]">
              <SearchBar value={search} onChange={setSearch} />
              <FilterTabs value={filter} onChange={setFilter} />
            </div>
          </div>

          <main className="mt-4">
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

          <footer className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
            React + Express + Prisma
          </footer>
        </section>
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

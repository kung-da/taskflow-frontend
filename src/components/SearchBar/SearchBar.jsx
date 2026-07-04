// src/components/SearchBar/SearchBar.jsx
import React from 'react';

/**
 * @param {{ value: string, onChange: (v: string) => void, placeholder?: string }} props
 */
export function SearchBar({ value, onChange, placeholder = 'Search todos…' }) {
  return (
    <div className="relative">
      {/* Search icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>

      <input
        id="todo-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search todos"
        className={[
          'w-full pl-9 pr-4 py-2.5 text-sm',
          'bg-white dark:bg-surface-800',
          'border border-slate-200 dark:border-surface-700',
          'rounded-xl shadow-sm',
          'text-slate-800 dark:text-slate-100 placeholder-slate-400',
          'transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'focus-visible:border-primary-500',
        ].join(' ')}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
}

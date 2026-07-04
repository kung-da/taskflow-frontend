// src/components/FilterTabs/FilterTabs.jsx
import React from 'react';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

/**
 * @param {{ value: string, onChange: (v: string) => void, counts?: { all: number, active: number, completed: number } }} props
 */
export function FilterTabs({ value, onChange, counts }) {
  return (
    <div
      className="flex gap-1 bg-slate-100 dark:bg-surface-800 p-1 rounded-xl"
      role="tablist"
      aria-label="Filter todos by status"
    >
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          id={`filter-tab-${tab.value}`}
          onClick={() => onChange(tab.value)}
          className={[
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg',
            'transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            value === tab.value
              ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
          ].join(' ')}
        >
          {tab.label}
          {counts && (
            <span
              className={[
                'text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center',
                value === tab.value
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                  : 'bg-slate-200 dark:bg-surface-600 text-slate-500 dark:text-slate-400',
              ].join(' ')}
            >
              {counts[tab.value] ?? 0}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

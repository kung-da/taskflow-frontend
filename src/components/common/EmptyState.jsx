// src/components/common/EmptyState.jsx
import React from 'react';
import { Button } from './Button.jsx';

/**
 * @param {{ title: string, description?: string, action?: { label: string, onClick: Function } }} props
 */
export function EmptyState({ title, description, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Illustration */}
      <div className="mb-4 text-6xl select-none" aria-hidden="true">📭</div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">{description}</p>
      )}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// src/components/TodoItem/TodoItem.jsx
// Renders a single todo with toggle, inline edit, and delete actions.
// Wrapped in React.memo to prevent re-renders when sibling todos change.

import React, { useState, memo } from 'react';
import { Button } from '../common/Button.jsx';
import { ConfirmDialog } from '../common/ConfirmDialog.jsx';
import { TodoForm } from '../TodoForm/TodoForm.jsx';

/**
 * @param {{
 *   todo: { id: number, title: string, description?: string, isCompleted: boolean },
 *   onToggle: (id: number) => Promise<void>,
 *   onEdit: (id: number, data: object) => Promise<void>,
 *   onDelete: (id: number) => Promise<void>,
 * }} props
 */
export const TodoItem = memo(function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggle(todo.id);
    } finally {
      setToggling(false);
    }
  };

  const handleEdit = async (data) => {
    await onEdit(todo.id, { ...data, isCompleted: todo.isCompleted });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div
        className={[
          'group flex flex-col gap-3 rounded-lg border p-4 transition-all duration-200 sm:flex-row sm:items-start',
          'bg-white dark:bg-surface-900 border-slate-200 dark:border-surface-700',
          'hover:border-primary-200 dark:hover:border-surface-600 hover:shadow-sm',
          'animate-slide-down',
          todo.isCompleted ? 'opacity-60' : '',
        ].join(' ')}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            onClick={handleToggle}
            disabled={toggling}
            aria-label={todo.isCompleted ? 'Mark incomplete' : 'Mark complete'}
            aria-pressed={todo.isCompleted}
            className={[
              'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              todo.isCompleted
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-300 text-transparent hover:border-primary-500 dark:border-surface-500',
            ].join(' ')}
          >
            <svg className="h-4 w-4" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <TodoForm
                initialValues={{ title: todo.title, description: todo.description }}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                submitLabel="Save changes"
                autoFocus
              />
            ) : (
              <>
                <span
                  className={[
                    'mb-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    todo.isCompleted
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                  ].join(' ')}
                >
                  {todo.isCompleted ? 'Completed' : 'Active'}
                </span>
              <p
                className={[
                  'text-base font-medium break-words',
                  todo.isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100',
                ].join(' ')}
              >
                {todo.title}
              </p>
              {todo.description && (
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 break-words">
                  {todo.description}
                </p>
              )}
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex gap-2 border-t border-slate-100 pt-3 dark:border-surface-700 sm:border-t-0 sm:pt-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit "${todo.title}"`}
              title="Edit"
              className="min-h-[38px]"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L4.5 13.42a4 4 0 00-.885 1.343z" />
              </svg>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete "${todo.title}"`}
              title="Delete"
              className="min-h-[38px]"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this todo?"
        message={`"${todo.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
});

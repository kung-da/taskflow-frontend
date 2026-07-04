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
          'group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
          'bg-white dark:bg-surface-800 border-slate-100 dark:border-surface-700',
          'hover:border-slate-200 dark:hover:border-surface-600 hover:shadow-sm',
          'animate-slide-down',
          todo.isCompleted ? 'opacity-60' : '',
        ].join(' ')}
      >
        {/* Checkbox / Toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          aria-label={todo.isCompleted ? 'Mark incomplete' : 'Mark complete'}
          aria-pressed={todo.isCompleted}
          className={[
            'mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center',
            'transition-all duration-200 cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'min-h-[44px] min-w-[44px] -m-2.5', // expanded touch target
            todo.isCompleted
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-slate-300 dark:border-surface-500 hover:border-primary-400',
          ].join(' ')}
        >
          {todo.isCompleted && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
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
              <p
                className={[
                  'text-sm font-medium break-words',
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

        {/* Action buttons (visible on hover / focus-within) */}
        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit "${todo.title}"`}
              title="Edit"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L4.5 13.42a4 4 0 00-.885 1.343z" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete "${todo.title}"`}
              title="Delete"
              className="hover:text-red-500"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
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

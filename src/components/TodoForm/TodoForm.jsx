// src/components/TodoForm/TodoForm.jsx
// Create (and optionally edit) a todo.
// Validates input on submit; shows inline errors.

import React, { useState, useRef, useEffect } from 'react';
import { validateTodoForm } from '../../utils/validators.js';
import { Button } from '../common/Button.jsx';
import { TODO_TITLE_MAX_LENGTH } from '../../utils/validators.js';

/**
 * @param {{
 *   onSubmit: (data: { title: string, description?: string }) => Promise<void>,
 *   initialValues?: { title?: string, description?: string },
 *   submitLabel?: string,
 *   onCancel?: () => void,
 *   autoFocus?: boolean,
 * }} props
 */
export function TodoForm({
  onSubmit,
  initialValues = {},
  submitLabel = 'Add Todo',
  onCancel,
  autoFocus = false,
}) {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (autoFocus) titleRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateTodoForm({ title, description });
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      // Reset form on success (for create mode)
      if (!initialValues.title) {
        setTitle('');
        setDescription('');
        titleRef.current?.focus();
      }
    } catch (err) {
      // Surface backend field errors
      if (err.field) {
        setErrors({ [err.field]: err.message });
      } else {
        setErrors({ _form: err.message ?? 'Failed to save todo' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {/* Title field */}
      <div>
        <label htmlFor="todo-title" className="sr-only">Todo title</label>
        <div className="relative">
          <input
            id="todo-title"
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: undefined })); }}
            placeholder="What needs to be done?"
            maxLength={TODO_TITLE_MAX_LENGTH + 10} // let backend rule + frontend counter handle it
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={[
              'w-full px-4 py-3 text-sm rounded-xl',
              'bg-white dark:bg-surface-800',
              'border transition-all duration-150',
              errors.title
                ? 'border-red-400 focus-visible:ring-red-400'
                : 'border-slate-200 dark:border-surface-700 focus-visible:ring-primary-500',
              'text-slate-800 dark:text-slate-100 placeholder-slate-400',
              'focus:outline-none focus-visible:ring-2',
            ].join(' ')}
          />
          {/* Character counter */}
          <span
            className={[
              'absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums',
              title.length > TODO_TITLE_MAX_LENGTH ? 'text-red-500' : 'text-slate-400',
            ].join(' ')}
            aria-live="polite"
          >
            {title.length}/{TODO_TITLE_MAX_LENGTH}
          </span>
        </div>
        {errors.title && (
          <p id="title-error" className="mt-1 text-xs text-red-500 animate-fade-in" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      {/* Form-level error */}
      {errors._form && (
        <p className="text-xs text-red-500 animate-fade-in" role="alert">{errors._form}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" loading={loading} className="flex-1">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

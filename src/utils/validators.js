// src/utils/validators.js
// Frontend validation rules that mirror the backend's todo.validator.js.
// Always keep these in sync with the backend rules — the backend is the source of truth,
// but these provide instant UX feedback before a request is made.

export const TODO_TITLE_MAX_LENGTH = 200;
export const TODO_DESCRIPTION_MAX_LENGTH = 1000;

/**
 * Validates a todo title.
 * @param {string} title
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateTitle(title) {
  const trimmed = (title ?? '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Title is required' };
  }
  if (trimmed.length > TODO_TITLE_MAX_LENGTH) {
    return { valid: false, error: `Title cannot exceed ${TODO_TITLE_MAX_LENGTH} characters` };
  }
  return { valid: true };
}

/**
 * Validates an optional todo description.
 * @param {string|undefined} description
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDescription(description) {
  if (!description) return { valid: true };
  if (description.trim().length > TODO_DESCRIPTION_MAX_LENGTH) {
    return {
      valid: false,
      error: `Description cannot exceed ${TODO_DESCRIPTION_MAX_LENGTH} characters`,
    };
  }
  return { valid: true };
}

/**
 * Validates the entire todo form (create/edit).
 * Returns an errors object with field keys.
 * @param {{ title: string, description?: string }} fields
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateTodoForm({ title, description }) {
  const errors = {};

  const titleResult = validateTitle(title);
  if (!titleResult.valid) errors.title = titleResult.error;

  const descResult = validateDescription(description);
  if (!descResult.valid) errors.description = descResult.error;

  return { isValid: Object.keys(errors).length === 0, errors };
}

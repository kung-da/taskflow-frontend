// src/api/todoApi.js
// All HTTP calls to the backend are isolated here.
// If the backend URL or response shape changes, only this file changes.
// Each function throws a normalized error object on non-2xx responses.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

/**
 * Normalizes non-2xx HTTP responses into a consistent error object.
 * @param {Response} res
 * @throws {{ message: string, code: string, field?: string, status: number }}
 */
async function handleResponse(res) {
  if (res.ok) {
    // 204 No Content has no body
    if (res.status === 204) return null;
    return res.json();
  }

  let errorBody;
  try {
    errorBody = await res.json();
  } catch {
    errorBody = { error: { message: 'Request failed', code: 'NETWORK_ERROR' } };
  }

  const error = errorBody?.error ?? {};
  throw {
    message: error.message ?? 'An unexpected error occurred',
    code: error.code ?? 'UNKNOWN_ERROR',
    field: error.field,
    status: res.status,
  };
}

/**
 * Fetch all todos with optional search/filter/pagination.
 * @param {{ search?: string, status?: string, page?: number, limit?: number, sortBy?: string, order?: string }} params
 */
export async function getTodos(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
  ).toString();

  const res = await fetch(`${BASE_URL}/todos${query ? `?${query}` : ''}`);
  return handleResponse(res);
}

/**
 * Fetch a single todo by id.
 * @param {number} id
 */
export async function getTodo(id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`);
  return handleResponse(res);
}

/**
 * Create a new todo.
 * @param {{ title: string, description?: string }} data
 */
export async function createTodo(data) {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Update a todo (full replace).
 * @param {number} id
 * @param {{ title: string, description?: string, isCompleted?: boolean }} data
 */
export async function updateTodo(id, data) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Toggle the completed status of a todo.
 * @param {number} id
 */
export async function toggleTodo(id) {
  const res = await fetch(`${BASE_URL}/todos/${id}/toggle`, { method: 'PATCH' });
  return handleResponse(res);
}

/**
 * Delete a todo.
 * @param {number} id
 */
export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

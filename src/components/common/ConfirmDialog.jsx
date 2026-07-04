// src/components/common/ConfirmDialog.jsx
// Accessible confirmation dialog — traps focus and handles keyboard dismissal.

import React, { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';

/**
 * @param {{
 *   open: boolean,
 *   title: string,
 *   message?: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   onConfirm: () => void,
 *   onCancel: () => void,
 *   loading?: boolean,
 * }} props
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) {
  const cancelRef = useRef(null);

  // Focus the cancel button when the dialog opens
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-xl w-full max-w-sm p-6 animate-bounce-in">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h2>
        {message && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        )}
        <div className="flex gap-3 justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

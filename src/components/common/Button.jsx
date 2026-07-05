// src/components/common/Button.jsx
// Reusable button with variant and size props.
// Always shows disabled state during pending actions to prevent double submits.

import React, { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-slate-200',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  ghost: 'hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-600 dark:text-slate-300',
};

const sizes = {
  sm: 'px-2.5 py-1 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-lg',
  icon: 'p-2 rounded-lg',
};

/**
 * @param {{ variant?: keyof variants, size?: keyof sizes, loading?: boolean, className?: string } & React.ButtonHTMLAttributes} props
 */
export const Button = forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'min-h-[44px]', // accessibility: minimum touch target
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

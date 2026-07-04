// tests/TodoItem.test.jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoItem } from '../src/components/TodoItem/TodoItem.jsx';

const mockTodo = {
  id: 1,
  title: 'Buy groceries',
  description: 'Milk, eggs, bread',
  isCompleted: false,
};

const noop = async () => {};

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(<TodoItem todo={mockTodo} onToggle={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<TodoItem todo={mockTodo} onToggle={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText('Milk, eggs, bread')).toBeInTheDocument();
  });

  it('calls onToggle when the toggle button is clicked', async () => {
    const onToggle = vi.fn().mockResolvedValue(undefined);
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onEdit={noop} onDelete={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }));
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(1));
  });

  it('applies line-through style when isCompleted is true', () => {
    const completedTodo = { ...mockTodo, isCompleted: true };
    render(<TodoItem todo={completedTodo} onToggle={noop} onEdit={noop} onDelete={noop} />);
    const title = screen.getByText('Buy groceries');
    expect(title).toHaveClass('line-through');
  });

  it('shows edit form when Edit button is clicked', async () => {
    render(<TodoItem todo={mockTodo} onToggle={noop} onEdit={noop} onDelete={noop} />);
    // Hover to show action buttons (simulate by focusing)
    fireEvent.mouseEnter(screen.getByText('Buy groceries').closest('[class*="group"]'));
    const editBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editBtn);
    await waitFor(() => expect(screen.getByDisplayValue('Buy groceries')).toBeInTheDocument());
  });

  it('shows confirm dialog when Delete is clicked', () => {
    render(<TodoItem todo={mockTodo} onToggle={noop} onEdit={noop} onDelete={noop} />);
    fireEvent.mouseEnter(screen.getByText('Buy groceries').closest('[class*="group"]'));
    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete this todo?')).toBeInTheDocument();
  });
});

// Task: P2-T-015
// Spec: specs/ui/components.md §TaskItem

import React from 'react';
import { Task } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from './ui/Badge';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 mb-3
        transition-all duration-200
        ${task.completed ? 'bg-gray-50' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`
            mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center
            transition-colors
            ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-primary-500'
            }
          `}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              text-base font-medium
              ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}
            `}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`
                mt-1 text-sm
                ${task.completed ? 'text-gray-400' : 'text-gray-600'}
              `}
            >
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={task.completed ? 'success' : 'pending'}>
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>
            <span className="text-xs text-gray-500">
              Created {formatDate(task.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            aria-label="Delete task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Task: P2-T-016
// Spec: specs/ui/components.md §TaskList

import React from 'react';
import { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { EmptyTasks } from './ui/EmptyState';
import { Spinner } from './ui/Spinner';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onCreateTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  onToggle,
  onEdit,
  onDelete,
  onCreateTask,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyTasks onCreateTask={onCreateTask} />;
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

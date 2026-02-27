// Task: P2-T-021
// Spec: specs/ui/pages.md §Home Page

'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskCreate } from '@/types';

export default function HomePage() {
  const { tasks, loading, error, fetchTasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
    }
  }, [error]);

  const handleCreateTask = async (data: TaskCreate) => {
    setIsSubmitting(true);
    try {
      await addTask(data);
      setToast({ message: 'Task created successfully!', type: 'success' });
      setIsCreateModalOpen(false);
    } catch (err) {
      setToast({ message: 'Failed to create task', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (data: TaskCreate) => {
    if (!editingTask) return;

    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, data);
      setToast({ message: 'Task updated successfully!', type: 'success' });
      setEditingTask(null);
    } catch (err) {
      setToast({ message: 'Failed to update task', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleComplete(id);
    } catch (err) {
      setToast({ message: 'Failed to update task', type: 'error' });
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      setToast({ message: 'Task deleted successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete task', type: 'error' });
    }
  };

  const pendingTasks = tasks.filter((t) => !t.completed).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-gray-600 mt-1">
              {pendingTasks} {pendingTasks === 1 ? 'task' : 'tasks'} remaining
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </Button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggleComplete}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onCreateTask={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        size="md"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            loading={isSubmitting}
          />
        )}
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
}

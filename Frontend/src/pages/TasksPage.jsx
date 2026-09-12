import React, { useEffect, useState } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { useProjectStore } from '../store/useProjectStore'
import { useAuthstore } from '../store/useAuthStore'
import { Loader, Plus, CheckSquare, Trash2, Edit2 } from 'lucide-react'

const TasksPage = () => {
  const { tasks, isLoading: isTasksLoading, getTasks, createTask, updateTaskStatus } = useTaskStore();
  const { projects, getProjects } = useProjectStore();
  const { authUser } = useAuthstore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    status: 'To Do',
    priority: 'Medium',
    due_date: ''
  });

  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    getTasks();
    if (authUser?.role !== 'Developer') {
      getProjects(); // Need projects to populate the Create form dropdown
    }
  }, [getTasks, getProjects, authUser]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const taskPayload = {
      ...newTask,
      project_id: parseInt(newTask.project_id),
      assigned_to: newTask.assigned_to ? parseInt(newTask.assigned_to) : null
    };

    if (editingTask) {
      await updateTask(editingTask, taskPayload);
    } else {
      await createTask(taskPayload);
    }
    
    setNewTask({
      title: '', description: '', project_id: '', assigned_to: '', status: 'To Do', priority: 'Medium', due_date: ''
    });
    setShowCreateForm(false);
    setEditingTask(null);
  };

  const handleEditClick = (task) => {
    setNewTask({
      title: task.title,
      description: task.description || '',
      project_id: task.project_id,
      assigned_to: task.assigned_to || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    });
    setEditingTask(task.id);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const canCreate = authUser?.role === 'Admin' || authUser?.role === 'Project Manager';

  // Helper for priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return { bg: '#fee2e2', text: '#991b1b' };
      case 'High': return { bg: '#ffedd5', text: '#9a3412' };
      case 'Medium': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Tasks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage your daily to-dos and priorities.
          </p>
        </div>
        
        {canCreate && (
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--brand-color)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Project</label>
                <select 
                  value={newTask.project_id}
                  onChange={(e) => setNewTask({...newTask, project_id: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  required
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Assign To (User ID)</label>
                <input 
                  type="number"
                  placeholder="Optional"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div style={{ flex: '1 1 150px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Due Date</label>
                <input 
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Description</label>
              <textarea 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '80px', fontFamily: 'inherit' }}
              />
            </div>

            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => {
                setShowCreateForm(false);
                setEditingTask(null);
                setNewTask({ title: '', description: '', project_id: '', assigned_to: '', status: 'To Do', priority: 'Medium', due_date: '' });
              }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isTasksLoading}>
                {isTasksLoading ? 'Saving...' : (editingTask ? 'Update Task' : 'Save Task')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {isTasksLoading && tasks.length === 0 ? (
        <div className="flex justify-center" style={{ padding: '3rem' }}>
          <Loader size={32} style={{ color: 'var(--text-secondary)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
          <CheckSquare size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>No tasks found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => {
            const colors = getPriorityColor(task.priority);
            return (
              <div key={task.id} className="card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                
                {/* Left Side: Details */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{task.title}</h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 600, 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      background: colors.bg,
                      color: colors.text
                    }}>
                      {task.priority}
                    </span>
                    {canCreate && (
                      <div className="flex gap-2 ml-2">
                        <button onClick={() => handleEditClick(task)} style={{ color: 'var(--text-secondary)' }} className="hover:text-blue-500">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} style={{ color: 'var(--text-secondary)' }} className="hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {task.description || "No description."}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                    {task.due_date && <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                    <span>Project ID: {task.project_id}</span>
                  </div>
                </div>

                {/* Right Side: Status Updater */}
                <div style={{ minWidth: '150px' }}>
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      borderRadius: '6px', 
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    {task.status === 'Overdue' && <option value="Overdue" disabled>Overdue</option>}
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default TasksPage

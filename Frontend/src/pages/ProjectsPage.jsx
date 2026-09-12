import React, { useEffect, useState } from 'react'
import { useProjectStore } from '../store/useProjectStore'
import { useAuthstore } from '../store/useAuthStore'
import { Loader, Plus, Folder, Trash2, Edit2 } from 'lucide-react'

const ProjectsPage = () => {
  const { projects, isLoading, getProjects, createProject } = useProjectStore();
  const { authUser } = useAuthstore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'Planning'
  });

  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (editingProject) {
      await updateProject(editingProject, newProject);
    } else {
      await createProject(newProject);
    }
    setNewProject({ name: '', description: '', status: 'Planning' });
    setShowCreateForm(false);
    setEditingProject(null);
  };

  const handleEditClick = (project) => {
    setNewProject({
      name: project.name,
      description: project.description || '',
      status: project.status
    });
    setEditingProject(project.id);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const canCreate = authUser?.role === 'Admin' || authUser?.role === 'Project Manager';

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Projects
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage and view all your active projects.
          </p>
        </div>
        
        {canCreate && (
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--brand-color)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h3>
          <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Initial Status</label>
                <select 
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Description</label>
              <textarea 
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '80px', fontFamily: 'inherit' }}
                required
              />
            </div>

            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => {
                setShowCreateForm(false);
                setEditingProject(null);
                setNewProject({ name: '', description: '', status: 'Planning' });
              }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : (editingProject ? 'Update Project' : 'Save Project')}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center" style={{ padding: '3rem' }}>
          <Loader size={32} style={{ color: 'var(--text-secondary)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
          <Folder size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>No projects found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Get started by creating a new project.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => (
            <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{project.name}</h3>
                <div className="flex gap-2 items-center">
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 500, 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    background: project.status === 'Active' ? '#dcfce7' : project.status === 'Completed' ? '#e0e7ff' : '#f3f4f6',
                    color: project.status === 'Active' ? '#166534' : project.status === 'Completed' ? '#3730a3' : '#374151'
                  }}>
                    {project.status}
                  </span>
                  {canCreate && (
                    <>
                      <button onClick={() => handleEditClick(project)} style={{ color: 'var(--text-secondary)' }} className="hover:text-blue-500">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} style={{ color: 'var(--text-secondary)' }} className="hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
                {project.description || "No description provided."}
              </p>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>ID: #{project.id}</span>
                <span>{new Date(project.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProjectsPage

import React from 'react'
import { useAuthstore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { authUser } = useAuthstore();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
          Welcome back, {authUser?.username}!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Here is a quick overview of what's happening today.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Projects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>0</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tasks Pending</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>0</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Members</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>0</p>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/tasks" className="btn btn-primary">
            View My Tasks
          </Link>
          {authUser?.role !== 'Developer' && (
            <Link to="/projects" className="btn btn-outline">
              Manage Projects
            </Link>
          )}
        </div>
      </div>

    </div>
  )
}

export default HomePage

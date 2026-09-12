import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthstore } from '../store/useAuthStore'
import { Bell, LogOut, User } from 'lucide-react'

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { authUser, logout } = useAuthstore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  if (!authUser) return null; 

  return (
    <nav style={{ 
      background: 'var(--bg-primary)', 
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div className="container flex items-center justify-between" style={{ height: '64px' }}>
        
        <div className="flex items-center gap-4">
          <Link to="/" style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--brand-color)', marginRight: '2rem' }}>
            TaskFlow
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/projects" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem' }} onMouseOver={(e) => e.target.style.color = 'var(--brand-color)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Projects</Link>
            <Link to="/tasks" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem' }} onMouseOver={(e) => e.target.style.color = 'var(--brand-color)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Tasks</Link>
            <Link to="/activity" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem' }} onMouseOver={(e) => e.target.style.color = 'var(--brand-color)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Activity feed</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ color: 'var(--text-secondary)', padding: '8px', borderRadius: '50%', display: 'flex' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Bell size={20} />
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '45px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                padding: '1rem',
                width: '300px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 50,
                borderRadius: '8px'
              }}>
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Notifications</h4>
                  <button style={{ fontSize: '0.75rem', color: 'var(--brand-color)', fontWeight: 500 }}>Mark all read</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                    You're all caught up!
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/profile" style={{ color: 'var(--text-secondary)', display: 'flex', padding: '8px', borderRadius: '50%' }}
             onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
             onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
            <User size={20} />
          </Link>
          
          <button onClick={handleLogout} style={{ color: 'var(--text-secondary)', display: 'flex', padding: '8px', borderRadius: '50%' }}
             onMouseOver={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = '#fff'; }}
             onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

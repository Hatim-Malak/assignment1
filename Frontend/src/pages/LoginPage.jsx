import React, { useState } from 'react'
import { useAuthstore } from '../store/useAuthStore'
import { Loader } from 'lucide-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { login, isLoggingIn } = useAuthstore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="flex items-center" style={{ minHeight: 'calc(100vh - 64px)', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--brand-color)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Sign in to continue to TaskFlow
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Username
            </label>
            <input 
              type="text" 
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoggingIn}
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '0.5rem', 
              padding: '0.75rem',
              opacity: isLoggingIn ? 0.7 : 1
            }}
          >
            {isLoggingIn ? <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default LoginPage

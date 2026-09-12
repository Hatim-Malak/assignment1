import React, { useEffect, useState } from 'react'
import { useClientStore } from '../store/useClientStore'
import { useAuthstore } from '../store/useAuthStore'
import { Loader, Plus, Users, Mail, Phone, Building } from 'lucide-react'

const ClientsPage = () => {
  const { clients, isLoading, getClients, createClient } = useClientStore();
  const { authUser } = useAuthstore();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    company_name: ''
  });

  useEffect(() => {
    getClients();
  }, [getClients]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createClient(newClient);
    setNewClient({ name: '', contact_email: '', contact_phone: '', company_name: '' });
    setShowCreateForm(false);
  };

  const canCreate = authUser?.role === 'Admin' || authUser?.role === 'Project Manager';

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Clients
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage the organizations and stakeholders you work with.
          </p>
        </div>
        
        {canCreate && (
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={16} /> New Client
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--brand-color)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Add New Client</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Contact Name</label>
                <input 
                  type="text" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Company Name</label>
                <input 
                  type="text" 
                  value={newClient.company_name}
                  onChange={(e) => setNewClient({...newClient, company_name: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={newClient.contact_email}
                  onChange={(e) => setNewClient({...newClient, contact_email: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={newClient.contact_phone}
                  onChange={(e) => setNewClient({...newClient, contact_phone: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowCreateForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && clients.length === 0 ? (
        <div className="flex justify-center" style={{ padding: '3rem' }}>
          <Loader size={32} style={{ color: 'var(--text-secondary)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
          <Users size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>No clients found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Get started by adding your first client.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {clients.map((client) => (
            <div key={client.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center gap-3" style={{ marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                  <Building size={20} style={{ color: 'var(--brand-color)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{client.company_name || client.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{client.name}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, marginBottom: '1.5rem' }}>
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <Mail size={16} />
                  <a href={`mailto:${client.contact_email}`} style={{ color: 'inherit' }}>{client.contact_email}</a>
                </div>
                {client.contact_phone && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Phone size={16} />
                    <span>{client.contact_phone}</span>
                  </div>
                )}
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>ID: #{client.id}</span>
                <span>Added {new Date(client.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ClientsPage

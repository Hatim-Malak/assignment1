import React, { useEffect } from 'react'
import { useActivityStore } from '../store/useActivityStore'
import { Loader, Activity } from 'lucide-react'

const ActivityPage = () => {
  const { activities, isLoading, getActivities } = useActivityStore();

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
          Activity Feed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Track recent updates and changes across your projects.
        </p>
      </div>

      {isLoading && activities.length === 0 ? (
        <div className="flex justify-center" style={{ padding: '3rem' }}>
          <Loader size={32} style={{ color: 'var(--text-secondary)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
          <Activity size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>No recent activity</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Things are pretty quiet right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((activity) => (
            <div key={activity.id} className="card" style={{ padding: '1rem 1.5rem' }}>
              <div className="flex items-center gap-3">
                <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '50%' }}>
                  <Activity size={18} style={{ color: 'var(--brand-color)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>
                    {activity.modified_by ? `${activity.modified_by} updated ` : 'System updated '}
                    <span style={{ color: 'var(--brand-color)' }}>"{activity.task_title || `Task #${activity.task_id}`}"</span>
                  </p>
                  {activity.old_status && activity.new_status && (
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Status changed from <strong>{activity.old_status}</strong> to <strong>{activity.new_status}</strong>
                    </p>
                  )}
                  <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
                    {new Date(activity.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityPage

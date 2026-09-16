import React from 'react';

export default function Notifications({ notifications }) {
  return (
    <div className="card">
      <h3>Notifications</h3>
      <p className="desc">Ye list real-time update hoti hai — operator/officer actions se turant notification aati hai.</p>
      {notifications.length === 0 ? (
        <div className="empty"><div className="ic">🔔</div>Koi notification nahi hai.</div>
      ) : (
        notifications.map((n) => (
          <div key={n._id} style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wheat-500)', marginTop: 6, flex: 'none' }}></div>
            <div>
              <div style={{ fontSize: 13.5 }}>{n.text}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 2 }}>{new Date(n.createdAt).toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

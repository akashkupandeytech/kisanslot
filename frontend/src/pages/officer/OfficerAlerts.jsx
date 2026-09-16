import React from 'react';
import api from '../../api.js';

export default function OfficerAlerts({ centres, showToast }) {
  const overloaded = centres.filter((c) => c.load >= 90);

  const sendAlert = async (id) => {
    await api.post(`/centres/${id}/alert`);
    showToast('Alert bhej diya gaya');
  };
  const reallocate = async (id) => {
    await api.post(`/centres/${id}/reallocate`);
    showToast('Staff reallocate ho gaya');
  };

  return (
    <div className="card">
      <h3>Congestion Alerts</h3>
      {overloaded.length === 0 ? (
        <div className="empty"><div className="ic">✅</div>Koi centre overloaded nahi hai.</div>
      ) : (
        overloaded.map((c) => (
          <div className="card" key={c._id} style={{ marginBottom: 12, background: 'var(--paper-100)' }}>
            <strong>{c.name}</strong> — {c.load}% load
            <p className="crumb" style={{ margin: '8px 0', fontSize: 13, color: 'var(--ink-500)' }}>
              Is centre par capacity se zyada load hai. Turant action lein.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn sm gold" onClick={() => sendAlert(c._id)}>Send Alert</button>
              <button className="btn sm ghost" onClick={() => reallocate(c._id)}>Reallocate Staff</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

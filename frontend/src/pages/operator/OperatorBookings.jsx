import React, { useState } from 'react';
import api from '../../api.js';

function statusBadge(s) {
  if (s.statusKey === 'checkedin') return <span className="badge ok">Checked-in</span>;
  if (s.statusKey === 'reslotted') return <span className="badge wait">Re-slotted</span>;
  return <span className="badge info">Confirmed</span>;
}

export default function OperatorBookings({ allSlots, refreshAllSlots, showToast }) {
  const [tokenInput, setTokenInput] = useState('');
  const [matched, setMatched] = useState(null);

  const scan = () => {
    const slot = allSlots.find((s) => s.token.toLowerCase() === tokenInput.trim().toLowerCase());
    if (!slot) { showToast('Token nahi mila'); setMatched(null); return; }
    setMatched(slot);
  };

  const checkin = async (id) => {
    await api.patch(`/slots/${id}/checkin`);
    showToast('Farmer check-in ho gaya');
    setMatched(null);
    setTokenInput('');
    refreshAllSlots();
  };

  const mismatch = async (id) => {
    await api.patch(`/slots/${id}/mismatch`);
    showToast('Quantity mismatch — auto re-slot ho gaya');
    setMatched(null);
    setTokenInput('');
    refreshAllSlots();
  };

  return (
    <>
      <div className="card">
        <h3>Token Scan Karein</h3>
        <p className="desc">Farmer ka token daal kar check-in ya mismatch mark karein.</p>
        <div className="row2">
          <div className="field">
            <label>Token</label>
            <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="jaise: KS-AB123" />
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn gold" onClick={scan}>Scan / Find</button>
          </div>
        </div>
        {matched && (
          <div className="card" style={{ marginTop: 4, background: 'var(--paper-100)' }}>
            <strong>Token Matched: {matched.token}</strong>
            <table style={{ marginTop: 10 }}>
              <tbody>
                <tr><td>Farmer</td><td>{matched.farmer?.name} ({matched.farmer?.mobile})</td></tr>
                <tr><td>Centre</td><td>{matched.centre}</td></tr>
                <tr><td>Window</td><td>{matched.window}</td></tr>
                <tr><td>Qty</td><td>{matched.qty} quintal</td></tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <button className="btn gold sm" onClick={() => checkin(matched._id)}>Check-in Karein</button>
              <button className="btn ghost sm" onClick={() => mismatch(matched._id)}>Quantity Mismatch</button>
            </div>
          </div>
        )}
      </div>

      <div className="section-title"><h3>Saari Bookings</h3></div>
      <div className="card">
        {allSlots.length === 0 ? (
          <div className="empty"><div className="ic">📋</div>Koi booking nahi hai.</div>
        ) : (
          <table>
            <thead><tr><th>Token</th><th>Farmer</th><th>Centre</th><th>Window</th><th>Qty</th><th>Status</th></tr></thead>
            <tbody>
              {allSlots.map((s) => (
                <tr key={s._id}>
                  <td><code>{s.token}</code></td><td>{s.farmer?.name}</td><td>{s.centre}</td>
                  <td>{s.window}</td><td>{s.qty}</td><td>{statusBadge(s)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

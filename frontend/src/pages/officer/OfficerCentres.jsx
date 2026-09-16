import React from 'react';
import api from '../../api.js';

export default function OfficerCentres({ centres, showToast }) {
  const sendAlert = async (id) => {
    await api.post(`/centres/${id}/alert`);
    showToast('Alert bhej diya gaya');
  };
  const reallocate = async (id) => {
    await api.post(`/centres/${id}/reallocate`);
    showToast('Staff reallocate ho gaya, load kam hua');
  };

  return (
    <div className="card">
      <h3>Centres Overview</h3>
      <p className="desc">Live load — jab koi farmer slot book/check-in karta hai toh yahan turant update hota hai.</p>
      <table>
        <thead><tr><th>Centre</th><th>Capacity</th><th>Load</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {centres.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.cap} q/hr</td><td>{c.load}%</td>
              <td>{c.load >= 90 ? <span className="badge err">Overloaded</span> : <span className="badge ok">Normal</span>}</td>
              <td>
                {c.load >= 90 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn sm ghost" onClick={() => sendAlert(c._id)}>Send Alert</button>
                    <button className="btn sm ghost" onClick={() => reallocate(c._id)}>Reallocate Staff</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

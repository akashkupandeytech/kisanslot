import React, { useState } from 'react';
import api from '../../api.js';

export default function Documents({ farmer, documents, refreshDocuments, showToast }) {
  const [form, setForm] = useState({ type: 'Aadhaar Card', name: '' });

  const submit = async () => {
    if (!farmer) { showToast('Pehle Farmer Registration karein'); return; }
    if (!form.name.trim()) { showToast('Document naam/number dalein'); return; }
    await api.post('/documents', { farmer: farmer._id, type: form.type, name: form.name });
    showToast('Document add ho gaya');
    setForm({ ...form, name: '' });
    refreshDocuments();
  };

  return (
    <>
      <div className="card">
        <h3>Documents Add Karein</h3>
        <p className="desc">Aadhaar, Khatauni, Bank Passbook jaise documents ke naam add karein.</p>
        <div className="row2">
          <div className="field">
            <label>Document Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Aadhaar Card</option><option>Khatauni / Land Record</option>
              <option>Bank Passbook</option><option>Procurement Receipt</option><option>Other</option>
            </select>
          </div>
          <div className="field">
            <label>Document Number / Naam</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="jaise: Khatauni No. 1123" />
          </div>
        </div>
        <button className="btn gold" onClick={submit}>Document Add Karein</button>
      </div>
      <div className="card">
        <h3>Aapke Documents</h3>
        {documents.length === 0 ? (
          <div className="empty"><div className="ic">📄</div>Registration complete karke documents generate karein.</div>
        ) : (
          <table>
            <thead><tr><th>Document</th><th>Type</th><th>Status</th></tr></thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d._id}><td>{d.name}</td><td>{d.type}</td><td><span className="badge ok">Saved</span></td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

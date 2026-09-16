import React, { useState } from 'react';
import api from '../../api.js';

export default function Help({ farmer, showToast }) {
  const [form, setForm] = useState({ topic: 'Slot booking issue', description: '' });
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    if (!farmer) { setMsg({ text: 'Pehle Farmer Registration karein.', ok: false }); return; }
    if (!form.description.trim()) { setMsg({ text: 'Apni samasya likhein.', ok: false }); return; }
    await api.post('/complaints', { farmer: farmer._id, topic: form.topic, description: form.description });
    setMsg({ text: 'Complaint darj ho gayi. Team jald sampark karegi.', ok: true });
    showToast('Complaint darj ho gayi');
    setForm({ ...form, description: '' });
  };

  return (
    <div className="card">
      <h3>Help &amp; Support</h3>
      <div className="field">
        <label>Complaint / Query Topic</label>
        <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
          <option>Slot booking issue</option><option>Payment delay</option>
          <option>Quality check dispute</option><option>Registration / verification</option>
        </select>
      </div>
      <div className="field">
        <label>Describe your issue</label>
        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="..." />
      </div>
      <button className="btn gold" onClick={submit}>Submit Complaint</button>
      {msg && <span style={{ color: msg.ok ? 'var(--ok)' : 'var(--clay-600)', marginLeft: 10, fontSize: 13 }}> {msg.text}</span>}
      <div className="note-box" style={{ marginTop: 18 }}>
        Feature-phone users toll-free Kisan Sahayata helpline par call kar sakte hain ya apne najdeeki CSC / VLE centre par ja sakte hain.
      </div>
    </div>
  );
}

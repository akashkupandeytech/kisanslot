import React, { useState } from 'react';
import api from '../../api.js';

export default function CropRegistration({ farmer, crops, refreshCrops, showToast }) {
  const [form, setForm] = useState({ crop: 'Wheat', qty: '', season: 'Rabi' });
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    if (!farmer) { setMsg({ text: 'Pehle Farmer Registration karein.', ok: false }); return; }
    const qty = parseFloat(form.qty);
    if (!qty || qty <= 0) { setMsg({ text: 'Sahi quantity dalein.', ok: false }); return; }
    try {
      await api.post('/crops', { farmer: farmer._id, crop: form.crop, qty, season: form.season });
      setMsg({ text: 'Crop add ho gayi.', ok: true });
      showToast(form.crop + ' register ho gayi');
      setForm({ ...form, qty: '' });
      refreshCrops();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Kuch galat hua.', ok: false });
    }
  };

  return (
    <>
      <div className="card">
        <h3>Naya Crop Register Karein</h3>
        <p className="desc">Fasal, quantity aur season ki jaankari bharein.</p>
        <div className="row3">
          <div className="field">
            <label>Fasal (Crop)</label>
            <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
              <option>Wheat</option><option>Paddy</option><option>Sugarcane</option>
              <option>Mustard</option><option>Maize</option><option>Cotton</option>
            </select>
          </div>
          <div className="field">
            <label>Quantity (quintal)</label>
            <input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="50" />
          </div>
          <div className="field">
            <label>Season</label>
            <select value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
              <option>Rabi</option><option>Kharif</option><option>Zaid</option>
            </select>
          </div>
        </div>
        <button className="btn gold" onClick={submit}>Crop Add Karein</button>
        {msg && <span style={{ color: msg.ok ? 'var(--ok)' : 'var(--clay-600)', marginLeft: 10, fontSize: 13 }}> {msg.text}</span>}
      </div>
      <div className="card">
        <h3>Registered Crops</h3>
        {crops.length === 0 ? (
          <div className="empty"><div className="ic">🌱</div>Abhi koi crop register nahi hui.</div>
        ) : (
          <table>
            <thead><tr><th>Fasal</th><th>Quantity</th><th>Season</th></tr></thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c._id}><td>{c.crop}</td><td>{c.qty} quintal</td><td>{c.season}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

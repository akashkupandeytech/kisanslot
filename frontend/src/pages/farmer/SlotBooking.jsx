import React, { useState, useEffect } from 'react';
import api from '../../api.js';

function statusBadge(s) {
  if (s.statusKey === 'checkedin') return <span className="badge ok">Checked-in</span>;
  if (s.statusKey === 'reslotted') return <span className="badge wait">Re-slotted</span>;
  return <span className="badge info">Confirmed</span>;
}

export default function SlotBooking({ farmer, crops, slots, refreshSlots, showToast }) {
  const [centres, setCentres] = useState([]);
  const [form, setForm] = useState({ centre: '', date: '', crop: '' });
  const [dyn, setDyn] = useState(null);
  const [msg, setMsg] = useState(null);
  const [lastToken, setLastToken] = useState(null);

  useEffect(() => {
    api.get('/centres').then((res) => {
      setCentres(res.data);
      if (res.data[0]) setForm((f) => ({ ...f, centre: res.data[0].name }));
    });
  }, []);

  useEffect(() => {
    if (crops[0] && !form.crop) setForm((f) => ({ ...f, crop: crops[0].crop }));
  }, [crops]);

  useEffect(() => {
    if (!form.centre || !form.date) { setDyn(null); return; }
    const cropDoc = crops.find((c) => c.crop === form.crop);
    const qty = cropDoc ? cropDoc.qty : 10;
    api.get('/slots/estimate', { params: { centre: form.centre, date: form.date, qty } })
      .then((res) => setDyn(res.data))
      .catch(() => setDyn(null));
  }, [form.centre, form.date, form.crop, crops]);

  const submit = async () => {
    if (!farmer) { setMsg({ text: 'Pehle Farmer Registration karein.', ok: false }); return; }
    if (!form.date || crops.length === 0) {
      setMsg({ text: 'Date chunein (aur pehle crop register karein).', ok: false });
      return;
    }
    const cropDoc = crops.find((c) => c.crop === form.crop);
    try {
      const res = await api.post('/slots', {
        farmer: farmer._id, centre: form.centre, date: form.date,
        crop: form.crop, qty: cropDoc ? cropDoc.qty : 10
      });
      setMsg({ text: 'Slot book ho gaya.', ok: true });
      showToast('Slot book ho gaya: token ' + res.data.token);
      setLastToken(res.data);
      refreshSlots();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Kuch galat hua.', ok: false });
    }
  };

  // Keep the token card in sync with live updates for that slot
  const liveToken = lastToken ? slots.find((s) => s._id === lastToken._id) || lastToken : null;

  return (
    <>
      <div className="card">
        <h3>Slot Book Karein</h3>
        <p className="desc">Centre, date aur fasal chunein — duration aur wait time live calculate hoga.</p>
        <div className="row2">
          <div className="field">
            <label>Procurement Centre</label>
            <select value={form.centre} onChange={(e) => setForm({ ...form, centre: e.target.value })}>
              {centres.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Fasal</label>
          <select value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
            {crops.length ? crops.map((c) => <option key={c._id}>{c.crop}</option>) : <option>Pehle crop register karein</option>}
          </select>
        </div>

        {dyn && (
          <div className="dyn-panel">
            <div className="dyn-metric"><div className="v">{dyn.duration} min</div><div className="l">Recommended Duration</div></div>
            <div className="dyn-metric"><div className="v">{dyn.centreLoad}%</div><div className="l">Centre Load Today</div></div>
            <div className="dyn-metric"><div className="v">{dyn.wait} min</div><div className="l">Live Estimated Wait</div></div>
            <div className="dyn-metric"><div className="v">{dyn.queueAhead}</div><div className="l">Farmers Ahead</div></div>
          </div>
        )}

        <button className="btn gold" onClick={submit}>Book Slot</button>
        {msg && <span style={{ color: msg.ok ? 'var(--ok)' : 'var(--clay-600)', marginLeft: 10, fontSize: 13 }}> {msg.text}</span>}
      </div>

      {liveToken && (
        <div className="token-card">
          <div className="qr">🎫</div>
          <div className="code">{liveToken.token}</div>
          <div className="sub">{liveToken.centre} • {liveToken.date} • {liveToken.window}</div>
          <div style={{ marginTop: 10 }}>{statusBadge(liveToken)}</div>
        </div>
      )}

      <div className="section-title"><h3>Aapke Booked Slots</h3></div>
      <div className="card">
        {slots.length === 0 ? (
          <div className="empty"><div className="ic">📅</div>Koi slot book nahi hua.</div>
        ) : (
          <table>
            <thead><tr><th>Centre</th><th>Date</th><th>Window</th><th>Qty</th><th>Token</th><th>Status</th></tr></thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s._id}>
                  <td>{s.centre}</td><td>{s.date}</td><td>{s.window}</td><td>{s.qty}</td>
                  <td><code>{s.token}</code></td><td>{statusBadge(s)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

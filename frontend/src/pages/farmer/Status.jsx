import React from 'react';

function stageOf(s) {
  if (s.weighDone) return 'Weighed';
  if (s.qualityDone) return 'Quality Checked';
  if (s.statusKey === 'checkedin') return 'Checked-in';
  if (s.statusKey === 'reslotted') return 'Re-slotted';
  return 'Booked';
}

export default function Status({ slots }) {
  return (
    <div className="card">
      <h3>Procurement Status</h3>
      <p className="desc">Ye status operator ke actions se live update hota hai.</p>
      {slots.length === 0 ? (
        <div className="empty"><div className="ic">📦</div>Slot book karke yahan status dekhein.</div>
      ) : (
        <table>
          <thead><tr><th>Fasal</th><th>Check-in</th><th>Quality Check</th><th>Weighing</th><th>Stage</th></tr></thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s._id}>
                <td>{s.crop} ({s.qty}q)</td>
                <td>{s.statusKey === 'checkedin' || s.qualityDone || s.weighDone ? <span className="badge ok">✓</span> : <span className="badge wait">Pending</span>}</td>
                <td>{s.qualityDone ? <span className="badge ok">✓</span> : <span className="badge wait">Pending</span>}</td>
                <td>{s.weighDone ? <span className="badge ok">✓</span> : <span className="badge wait">Pending</span>}</td>
                <td><span className="badge info">{stageOf(s)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

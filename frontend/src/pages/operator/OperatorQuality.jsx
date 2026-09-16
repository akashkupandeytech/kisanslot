import React from 'react';
import api from '../../api.js';

export default function OperatorQuality({ allSlots, refreshAllSlots, showToast }) {
  const checkedIn = allSlots.filter((s) => s.statusKey === 'checkedin');

  const markQuality = async (id) => {
    await api.patch(`/slots/${id}/quality`);
    showToast('Quality check complete');
    refreshAllSlots();
  };
  const markWeigh = async (id) => {
    await api.patch(`/slots/${id}/weigh`);
    showToast('Weighing complete — payment shuru hua');
    refreshAllSlots();
  };
  const advancePayment = async (id) => {
    await api.patch(`/slots/${id}/payment`);
    showToast('Payment stage advance ho gaya');
    refreshAllSlots();
  };

  return (
    <div className="card">
      <h3>Quality Check &amp; Weighing</h3>
      <p className="desc">Checked-in farmers ke liye quality check, weighing aur payment stage update karein.</p>
      {checkedIn.length === 0 ? (
        <div className="empty"><div className="ic">⚖️</div>Koi checked-in booking nahi hai.</div>
      ) : (
        <table>
          <thead><tr><th>Token</th><th>Farmer</th><th>Qty</th><th>Quality</th><th>Weighing</th><th>Payment</th></tr></thead>
          <tbody>
            {checkedIn.map((s) => (
              <tr key={s._id}>
                <td><code>{s.token}</code></td><td>{s.farmer?.name}</td><td>{s.qty}</td>
                <td>{s.qualityDone ? <span className="badge ok">✓ Done</span> : <button className="btn sm ghost" onClick={() => markQuality(s._id)}>Mark Quality</button>}</td>
                <td>{s.weighDone ? <span className="badge ok">✓ Done</span> : <button className="btn sm ghost" disabled={!s.qualityDone} onClick={() => markWeigh(s._id)}>Mark Weigh</button>}</td>
                <td>
                  {s.weighDone ? (
                    s.paymentStage === 'Credited'
                      ? <span className="badge ok">Credited</span>
                      : <button className="btn sm gold" onClick={() => advancePayment(s._id)}>{s.paymentStage} → Next</button>
                  ) : <span className="badge wait">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

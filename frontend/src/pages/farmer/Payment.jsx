import React, { useState, useEffect } from 'react';
import api from '../../api.js';

function stageBadge(stage) {
  if (stage === 'Credited') return <span className="badge ok">Credited</span>;
  if (stage === 'Processed') return <span className="badge wait">Processed</span>;
  if (stage === 'Initiated') return <span className="badge info">Initiated</span>;
  return <span className="badge wait">Not started</span>;
}

export default function Payment({ slots }) {
  const [prices, setPrices] = useState([]);
  useEffect(() => { api.get('/market').then((res) => setPrices(res.data)); }, []);

  const payable = slots.filter((s) => s.weighDone);
  const rateFor = (crop) => prices.find((p) => p.crop === crop)?.price || 2000;

  return (
  <div className="card">
  <h3>{t('payment.title')}</h3>

  <p className="desc">
    {t('payment.description')}
  </p>

  {payable.length === 0 ? (
    <div className="empty">
      <div className="ic">💰</div>
      {t('payment.empty')}
    </div>
  ) : (
    <table>
      <thead>
        <tr>
          <th>{t('payment.crop')}</th>
          <th>{t('payment.amount')}</th>
          <th>{t('payment.stage')}</th>
        </tr>
      </thead>

      <tbody>
        {payable.map((s) => (
          <tr key={s._id}>
            <td>
              {s.crop} ({s.qty}q)
            </td>

            <td>
              ₹{(rateFor(s.crop) * s.qty).toLocaleString('en-IN')}
            </td>

            <td>
              {stageBadge(s.paymentStage)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

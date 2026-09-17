import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function stageBadge(stage, t) {
  if (stage === 'Credited') {
    return <span className="badge ok">{t('payment.credited')}</span>;
  }

  if (stage === 'Processed') {
    return <span className="badge wait">{t('payment.processed')}</span>;
  }

  if (stage === 'Initiated') {
    return <span className="badge info">{t('payment.initiated')}</span>;
  }

  return (
    <span className="badge wait">
      {t('payment.notStarted')}
    </span>
  );
}

export default function Payment({ slots }) {
  const { t } = useLanguage();

  const [prices, setPrices] = useState([]);

  useEffect(() => {
    api
      .get('/market')
      .then((res) => setPrices(res.data))
      .catch((err) => {
        console.error('Failed to load market prices:', err);
      });
  }, []);

  const payable = (slots || []).filter((s) => s.weighDone);

  const rateFor = (crop) =>
    prices.find((p) => p.crop === crop)?.price || 2000;

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
                  ₹
                  {(rateFor(s.crop) * s.qty).toLocaleString(
                    'en-IN'
                  )}
                </td>

                <td>
                  {stageBadge(s.paymentStage, t)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

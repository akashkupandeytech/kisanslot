import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function Market() {
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

  return (
    <div className="card">
      <h3>{t('market.title')}</h3>

      <table>
        <thead>
          <tr>
            <th>{t('market.crop')}</th>
            <th>{t('market.msp')}</th>
            <th>{t('market.trend')}</th>
          </tr>
        </thead>

        <tbody>
          {prices.map((p) => (
            <tr key={p.crop}>
              <td>{p.crop}</td>

              <td>
                ₹{p.price.toLocaleString('en-IN')}
              </td>

              <td>
                {p.change > 0 && (
                  <span className="badge ok">
                    ▲ {p.change}%
                  </span>
                )}

                {p.change < 0 && (
                  <span className="badge err">
                    ▼ {Math.abs(p.change)}%
                  </span>
                )}

                {p.change === 0 && (
                  <span className="badge info">
                    — 0.0%
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

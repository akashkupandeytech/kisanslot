import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function Centres({ centres }) {
  const { t } = useLanguage();

  return (
    <div className="card">
      <h3>{t('centres.title')}</h3>

      <p className="desc">
        {t('centres.description')}
      </p>

      <table>
        <thead>
          <tr>
            <th>{t('centres.centre')}</th>
            <th>{t('centres.capacity')}</th>
            <th>{t('centres.currentLoad')}</th>
            <th>{t('centres.congestion')}</th>
          </tr>
        </thead>

        <tbody>
          {(centres || []).map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>

              <td>
                {c.cap} q/hr
              </td>

              <td>
                {c.load}%
              </td>

              <td>
                {c.load >= 90 ? (
                  <span className="badge err">
                    {t('centres.overloaded')}
                  </span>
                ) : (
                  <span className="badge ok">
                    {t('centres.normal')}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {centres?.some((c) => c.load >= 90) && (
        <div
          className="note-box"
          style={{ marginTop: 16 }}
        >
          {t('centres.alert')}
        </div>
      )}
    </div>
  );
}

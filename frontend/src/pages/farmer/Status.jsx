import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function stageOf(s, t) {
  if (s.weighDone) return t('status.weighed');
  if (s.qualityDone) return t('status.qualityChecked');
  if (s.statusKey === 'checkedin') return t('status.checkedIn');
  if (s.statusKey === 'reslotted') return t('status.reslotted');
  return t('status.booked');
}

export default function Status({ slots = [] }) {
  const { t } = useLanguage();

  return (
    <div className="card">
      <h3>{t('status.title')}</h3>

      <p className="desc">
        {t('status.description')}
      </p>

      {slots.length === 0 ? (
        <div className="empty">
          <div className="ic">📦</div>
          {t('status.empty')}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('status.crop')}</th>
              <th>{t('status.checkIn')}</th>
              <th>{t('status.qualityCheck')}</th>
              <th>{t('status.weighing')}</th>
              <th>{t('status.stage')}</th>
            </tr>
          </thead>

          <tbody>
            {slots.map((s) => (
              <tr key={s._id}>
                <td>
                  {s.crop} ({s.qty}q)
                </td>

                <td>
                  {s.statusKey === 'checkedin' ||
                  s.qualityDone ||
                  s.weighDone ? (
                    <span className="badge ok">✓</span>
                  ) : (
                    <span className="badge wait">
                      {t('status.pending')}
                    </span>
                  )}
                </td>

                <td>
                  {s.qualityDone ? (
                    <span className="badge ok">✓</span>
                  ) : (
                    <span className="badge wait">
                      {t('status.pending')}
                    </span>
                  )}
                </td>

                <td>
                  {s.weighDone ? (
                    <span className="badge ok">✓</span>
                  ) : (
                    <span className="badge wait">
                      {t('status.pending')}
                    </span>
                  )}
                </td>

                <td>
                  <span className="badge info">
                    {stageOf(s, t)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

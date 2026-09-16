import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const ROLES = [
  { id: 'farmer', icon: '🧑‍🌾', titleKey: 'role.farmer', descKey: 'role.farmer.desc' },
  { id: 'operator', icon: '🏢', titleKey: 'role.operator', descKey: 'role.operator.desc' },
  { id: 'officer', icon: '🗂️', titleKey: 'role.officer', descKey: 'role.officer.desc' }
];

export default function RoleGate({ onChoose, onBack }) {
  const { t } = useLanguage();
  return (
    <div className="gate">
      <div className="gate-card">
        <button
          onClick={onBack}
          style={{ all: 'unset', cursor: 'pointer', color: 'var(--ink-500)', fontSize: '.82rem', fontWeight: 600, marginBottom: 14, display: 'inline-flex', gap: 6, alignItems: 'center' }}
        >
          ← {t('common.switchLanguage')}
        </button>
        <div className="gate-mark">🔐</div>
        <h1>{t('role.title')}</h1>
        <p className="gate-sub">{t('role.subtitle')}</p>
        <div className="role-grid">
          {ROLES.map((r) => (
            <div className="role-card" key={r.id} onClick={() => onChoose(r.id)}>
              <div className="ic">{r.icon}</div>
              <h4>{t(r.titleKey)}</h4>
              <p>{t(r.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

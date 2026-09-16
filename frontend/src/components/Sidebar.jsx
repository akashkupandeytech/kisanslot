import React from 'react';
import { NAV_BY_ROLE, ROLE_LABEL_KEY } from '../navConfig.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Sidebar({ role, active, onNavigate, liveConnected }) {
  const { t } = useLanguage();
  const items = NAV_BY_ROLE[role] || [];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">🌾</div>
        <div>
          <h2>KisanSlot</h2>
          <small>Farmer Procurement System</small>
        </div>
      </div>
      <span className="role-tag">{t(ROLE_LABEL_KEY[role])}</span>
      <nav className="navlist">
        {items.map((item) => (
          <button
            key={item.id}
            className={active === item.id ? 'active' : ''}
            onClick={() => onNavigate(item.id)}
          >
            <span className="ic">{item.icon}</span>
            <span>{t(item.key)}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <span className="live-dot">
          <span className="d"></span> {liveConnected ? t('common.liveOn') : t('common.connecting')}
        </span>
        <br />
        Uttarakhand Krishi Vibhag
      </div>
    </aside>
  );
}

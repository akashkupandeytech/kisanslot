import React from 'react';
import { NAV_BY_ROLE } from '../navConfig.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function Topbar({ role, active, farmer, onSwitchRole }) {
  const { t } = useLanguage();
  const items = NAV_BY_ROLE[role] || [];
  const current = items.find((i) => i.id === active) || items[0];
  const initials = farmer?.name
    ? farmer.name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="topbar">
      <div>
        <h1>{t(current?.key)}</h1>
        <div className="crumb">{t('common.home')} / {t(current?.key)}</div>
      </div>
      <div className="top-actions">
        <LanguageSwitcher />
        {role === 'farmer' && (
          <div className="farmer-chip">
            <div className="av">{initials}</div>
            <span>{farmer?.name || t('common.registerPrompt')}</span>
          </div>
        )}
        <button className="btn-switchrole" onClick={onSwitchRole}>{t('common.switchRole')}</button>
      </div>
    </div>
  );
}

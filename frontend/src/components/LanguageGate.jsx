import React from 'react';
import { LANGUAGES } from '../i18n/languages.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function LanguageGate({ onChosen }) {
  const { setLang, t } = useLanguage();

  const choose = (code) => {
    setLang(code);
    if (onChosen) onChosen();
  };

  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-mark">🌾</div>
        <h1>{t('gate.title')}</h1>
        <p className="gate-sub">{t('gate.language.sub')}</p>
        <div className="lang-grid">
          {LANGUAGES.map((l) => (
            <button key={l.code} className="lang-btn" onClick={() => choose(l.code)}>
              <span className="native">{l.native}</span>
              <small>{l.label}</small>
            </button>
          ))}
        </div>
        <p className="gate-foot">{t('gate.language.foot')}</p>
      </div>
    </div>
  );
}

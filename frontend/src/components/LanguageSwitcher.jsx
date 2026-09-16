import React from 'react';
import { LANGUAGES } from '../i18n/languages.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      style={{ width: 'auto', padding: '9px 10px', fontSize: '.82rem', fontWeight: 600 }}
      aria-label="Language"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>{l.native}</option>
      ))}
    </select>
  );
}

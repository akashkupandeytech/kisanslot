import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations.js';
import { DEFAULT_LANG } from './languages.js';

const LANG_KEY = 'kisanslot_lang';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(LANG_KEY) || null);

  const setLang = (code) => {
    setLangState(code);
    localStorage.setItem(LANG_KEY, code);
  };

  useEffect(() => {
    document.documentElement.lang = lang || DEFAULT_LANG;
  }, [lang]);

  // t(key) looks up the current language, falls back to English, then to the key itself
  const t = (key) => {
    const active = lang || DEFAULT_LANG;
    return (translations[active] && translations[active][key])
      || (translations.en && translations.en[key])
      || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types';
import { getLanguage, setLanguage } from '@/lib/storage';
import { useTranslations, TranslationKey } from '@/lib/translations';

interface LangContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    setLangState(getLanguage());
  }, []);

  const handleSetLang = (l: Language) => {
    setLangState(l);
    setLanguage(l);
  };

  const t = useTranslations(lang);

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

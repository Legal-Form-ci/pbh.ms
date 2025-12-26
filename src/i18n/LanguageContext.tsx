import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, languages, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pbhms-language');
      if (saved && ['fr', 'en', 'ar', 'zh', 'de', 'es'].includes(saved)) {
        return saved as Language;
      }
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (['fr', 'en', 'ar', 'zh', 'de', 'es'].includes(browserLang)) {
        return browserLang as Language;
      }
    }
    return 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pbhms-language', lang);
    
    // Update document direction for RTL languages
    const langConfig = languages.find(l => l.code === lang);
    if (langConfig) {
      document.documentElement.dir = langConfig.dir;
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    const langConfig = languages.find(l => l.code === language);
    if (langConfig) {
      document.documentElement.dir = langConfig.dir;
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations['fr'][key] || key;
  };

  const dir = languages.find(l => l.code === language)?.dir || 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

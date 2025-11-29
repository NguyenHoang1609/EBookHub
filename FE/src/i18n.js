// Lightweight internal i18n helper (no external deps)
const locales = {
  en: require('./locales/en.json'),
  vi: require('./locales/vi.json')
};

let currentLang = localStorage.getItem('lang') || 'en';

export const t = (key) => {
  const segments = key.split('.');
  let v = locales[currentLang];
  for (const seg of segments) {
    if (!v) return key;
    v = v[seg];
  }
  return v || key;
};

export const useTranslation = () => {
  const changeLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    // rudimentary: force page reload to make changes visible
    window.location.reload();
  };
  return { t, i18n: { language: currentLang, changeLanguage } };
};

export default { t, useTranslation };

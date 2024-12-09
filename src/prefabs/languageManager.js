
let currentLanguage = 'en';

function getTranslations() {
    if (currentLanguage === 'ch') {
      return globalThis.chTranslations;
    }else if (currentLanguage === 'ar'){
      return globalThis.arTranslations;
    }
    return globalThis.enTranslations;
}

function switchLanguage(lang) {
    currentLanguage = lang;
  }
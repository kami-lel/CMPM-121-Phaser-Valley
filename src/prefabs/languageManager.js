
let currentLanguage = 'en';

function getTranslations() {
    if (currentLanguage === 'ch') {
      return window.chTranslations;
    }else if (currentLanguage === 'ar'){
      return window.arTranslations;
    }
    return window.enTranslations;
}

function switchLanguage(lang) {
    currentLanguage = lang;
  }
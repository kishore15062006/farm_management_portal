import { useTranslation as useReactTranslation } from 'react-i18next';
import { useState } from 'react';

const CACHE_KEY = 'fmp_auto_translations';
const translationCache = (() => {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch (e) {
        return {};
    }
})();

const saveCache = () => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(translationCache));
    } catch (e) {
        // ignore storage limits
    }
};

export const useTranslation = (ns, options) => {
    const { t: originalT, i18n } = useReactTranslation(ns, options);
    const currentLanguage = i18n.language || 'en';
    const [, forceUpdate] = useState(0);

    const t = (key, defaultValue) => {
        if (!key) return '';

        if (typeof key !== 'string') {
            return originalT(key, defaultValue);
        }

        // Try original i18next localization mapping
        const translated = originalT(key, defaultValue);

        // If translation is successful (not matching the missing key)
        if (translated !== key) {
            return translated;
        }

        const textToTranslate = defaultValue || key;

        // If target is English, no translation needed
        if (currentLanguage.startsWith('en')) {
            return textToTranslate;
        }

        const targetLang = currentLanguage.split('-')[0];
        const cacheKey = `${targetLang}:${textToTranslate}`;

        // Return from cache if present
        if (translationCache[cacheKey]) {
            return translationCache[cacheKey];
        }

        // Set fallback in cache to prevent duplicate fetches
        translationCache[cacheKey] = textToTranslate;

        const langPair = `en|${targetLang}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${langPair}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data?.responseData?.translatedText) {
                    translationCache[cacheKey] = data.responseData.translatedText;
                    saveCache();
                    forceUpdate(prev => prev + 1); // trigger re-render
                }
            })
            .catch(err => {
                console.error('Dynamic translation failed:', err);
            });

        return textToTranslate;
    };

    return { t, i18n };
};

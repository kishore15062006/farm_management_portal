import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const LANG_STORAGE_KEY = 'i18nextLng';
export default function LanguageSwitcher({ className = '' }) {
    const { t, i18n } = useTranslation();
    // Ensure html[lang] attribute and persisted language
    useEffect(() => {
        const current = i18n.language || 'en';
        document.documentElement.setAttribute('lang', current);
        try {
            localStorage.setItem(LANG_STORAGE_KEY, current);
        }
        catch { }
    }, [i18n.language]);
    return (<div className={`flex items-center gap-2 w-full max-w-[200px] ${className}`}>
        <Label htmlFor="language" className="text-sm font-medium shrink-0">{t('language')}</Label>
        <Select value={i18n.language || 'en'} onValueChange={(lng) => i18n.changeLanguage(lng)}>
          <SelectTrigger className="flex-1 h-9">
            <SelectValue placeholder={t('language')}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t('english')}</SelectItem>
            <SelectItem value="ta">{t('tamil')}</SelectItem>
            <SelectItem value="hi">{t('hindi')}</SelectItem>
          </SelectContent>
        </Select>
    </div>);
}

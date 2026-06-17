import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LANG_STORAGE_KEY = 'i18nextLng';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();

  // Ensure html[lang] attribute and persisted language
  useEffect(() => {
    const current = i18n.language || 'en';
    document.documentElement.setAttribute('lang', current);
    try { localStorage.setItem(LANG_STORAGE_KEY, current); } catch {}
  }, [i18n.language]);

  return (
    <div className={`w-full max-w-md mx-auto mb-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="language">{t('language')}</Label>
        <Select value={i18n.language || 'en'} onValueChange={(lng: string) => i18n.changeLanguage(lng)}>
          <SelectTrigger>
            <SelectValue placeholder={t('language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t('english')}</SelectItem>
            <SelectItem value="ta">{t('tamil')}</SelectItem>
            <SelectItem value="hi">{t('hindi')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

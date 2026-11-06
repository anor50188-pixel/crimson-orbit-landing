import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  return <div className="language-segments" role="group" aria-label={t('app.shared.language')}>
    {(['uz', 'ru', 'en'] as const).map(value => <Button key={value} variant="workspace" size="workspace" type="button" aria-pressed={language === value} onClick={() => setLanguage(value)}>{value.toUpperCase()}</Button>)}
  </div>;
}
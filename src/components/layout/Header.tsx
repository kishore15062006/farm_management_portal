import { Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'veterinarian': return 'bg-info/10 text-info border-info/20';
      case 'regulator': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder={t('searchPlaceholder')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Global language switcher (compact) */}
        <div className="hidden sm:block w-40">
          <LanguageSwitcher className="mb-0" />
        </div>
        {/* Notifications */}
        <NotificationDropdown />

        {/* Dark mode toggle */}
        <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* User info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <Badge className={getRoleBadgeColor(user?.role || '')}>
              {user?.role ? t(user.role) : ''}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            {t('logout')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
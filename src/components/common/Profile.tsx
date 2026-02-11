import React, { useState } from 'react';
import { User, Phone, Globe, Moon, Sun, LogOut, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useUpdateUser } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation, type Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const languages: { id: Language; label: string }[] = [
  { id: 'uz', label: "O'zbek" },
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, language, theme, setLanguage, setTheme, logout } = useApp();
  const updateUser = useUpdateUser();
  const [showLanguages, setShowLanguages] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleThemeToggle = () => {
    hapticFeedback.selection();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleLanguageChange = (lang: Language) => {
    hapticFeedback.selection();
    setLanguage(lang);
    setShowLanguages(false);
  };

  const handleLogout = () => {
    hapticFeedback.medium();
    logout();
    navigate('/');
  };

  const fullName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : '';

  return (
    <div className="tg-screen bg-background">
      <Header title={t('profile')} />

      <div className="p-4 space-y-4">
        {/* User info */}
        <div className="tg-card animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{fullName}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {user?.phone}
              </p>
              {user?.company && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Building2 className="w-4 h-4" />
                  {user.company}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">Настройки</p>
          <div className="bg-card rounded-xl overflow-hidden border border-border/50">
            {/* Language */}
            <button
              onClick={() => {
                hapticFeedback.selection();
                setShowLanguages(!showLanguages);
              }}
              className="tg-list-item w-full"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Язык</p>
                <p className="text-sm text-muted-foreground">
                  {languages.find(l => l.id === language)?.label}
                </p>
              </div>
              <ChevronRight className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                showLanguages && 'rotate-90'
              )} />
            </button>

            {/* Language options */}
            {showLanguages && (
              <div className="border-t border-border/50 animate-fade-in">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={cn(
                      'tg-list-item w-full pl-16',
                      language === lang.id && 'bg-primary/5'
                    )}
                  >
                    <span className={language === lang.id ? 'text-primary font-medium' : ''}>
                      {lang.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Theme */}
            <button onClick={handleThemeToggle} className="tg-list-item w-full">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Тема</p>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Тёмная' : 'Светлая'}
                </p>
              </div>
              <div className={cn(
                'w-12 h-7 rounded-full transition-colors relative',
                theme === 'dark' ? 'bg-primary' : 'bg-secondary'
              )}>
                <div className={cn(
                  'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={handleLogout}
            className="tg-card w-full flex items-center gap-3 text-destructive"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

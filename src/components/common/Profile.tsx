import React from 'react';
import { User, Phone, LogOut, Moon, Sun, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { hapticFeedback } from '@/lib/telegram';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const Profile: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    hapticFeedback.light();
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const handleLogout = () => {
    hapticFeedback.warning();
    logout();
    navigate('/');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'seller': return 'Продавец';
      case 'customer': return 'Покупатель';
      case 'technician': return 'Мастер';
      default: return '';
    }
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Профиль" />

      <div className="p-4 space-y-4">
        {/* User info card */}
        <div className="tg-card animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">Контактная информация</p>
          <div className="tg-card">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span>{user?.phone}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="tg-section-header">Настройки</p>
          <div className="bg-card rounded-xl overflow-hidden border border-border/50">
            <button
              onClick={toggleTheme}
              className="tg-list-item w-full"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                {isDark ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-warning" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Тема оформления</p>
                <p className="text-sm text-muted-foreground">
                  {isDark ? 'Тёмная' : 'Светлая'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <button
            onClick={handleLogout}
            className="tg-button-secondary w-full flex items-center justify-center gap-2 text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

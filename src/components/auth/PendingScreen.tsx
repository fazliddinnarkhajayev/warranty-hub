import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getTranslation } from '@/lib/i18n';

export const PendingScreen: React.FC = () => {
  const { language, telegramUser, logout } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-6 animate-fade-in">
        {/* Icon */}
        <div className="w-24 h-24 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-12 h-12 text-warning" />
        </div>

        {/* Message */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{t('pending_review')}</h1>
          <p className="text-muted-foreground">{t('pending_message')}</p>
        </div>

        {/* Info card */}
        <div className="tg-card text-left">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="font-medium">Заявка отправлена</span>
          </div>
          {telegramUser && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Имя: {telegramUser.first_name} {telegramUser.last_name}</p>
              {telegramUser.phone && <p>Телефон: {telegramUser.phone}</p>}
            </div>
          )}
        </div>

        {/* Help text */}
        <p className="text-sm text-muted-foreground">
          Мы уведомим вас через Telegram, когда ваша заявка будет одобрена
        </p>

        {/* Logout */}
        <button
          onClick={logout}
          className="tg-button-ghost text-muted-foreground"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

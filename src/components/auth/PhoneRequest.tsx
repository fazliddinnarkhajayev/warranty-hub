import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { hapticFeedback, getTelegramWebApp } from '@/lib/telegram';
import { formatUzbekPhone, isValidUzbekPhone, UZBEK_PHONE_PLACEHOLDER } from '@/lib/phoneUtils';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export const PhoneRequest: React.FC = () => {
  const navigate = useNavigate();
  const { telegramUser, language, checkAuth, setAuthStatus } = useApp();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRequestingContact, setIsRequestingContact] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // Try to request contact from Telegram
  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (webApp && 'requestContact' in webApp) {
      setIsRequestingContact(true);
      // Telegram WebApp 6.9+ has requestContact
      try {
        (webApp as any).requestContact((success: boolean, contact: any) => {
          setIsRequestingContact(false);
          if (success && contact?.phone_number) {
            const formattedPhone = formatUzbekPhone(contact.phone_number);
            setPhone(formattedPhone);
            // Auto-submit if we got a valid phone
            if (isValidUzbekPhone(formattedPhone)) {
              handleSubmit(formattedPhone);
            }
          }
        });
      } catch {
        setIsRequestingContact(false);
      }
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setPhone(formatted);
    setError('');
  };

  const handleSubmit = async (phoneToSubmit?: string) => {
    const phoneNumber = phoneToSubmit || phone;
    
    if (!isValidUzbekPhone(phoneNumber)) {
      setError('Введите корректный номер телефона');
      hapticFeedback.error();
      return;
    }

    setIsLoading(true);
    setError('');
    hapticFeedback.medium();

    try {
      const status = await checkAuth(phoneNumber);
      
      if (status === 'approved') {
        hapticFeedback.success();
        // Will redirect based on role in App.tsx
      } else if (status === 'pending') {
        hapticFeedback.warning();
        navigate('/pending');
      } else {
        // not_found - go to registration
        setAuthStatus('not_found');
        navigate('/register', { state: { phone: phoneNumber } });
      }
    } catch (err) {
      setError(t('network_error'));
      hapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  };

  if (isRequestingContact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Welcome */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('welcome')}</h1>
          {telegramUser && (
            <p className="text-muted-foreground">
              {telegramUser.first_name} {telegramUser.last_name}
            </p>
          )}
        </div>

        {/* Phone input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Номер телефона
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder={UZBEK_PHONE_PLACEHOLDER}
              className={cn(
                'tg-input w-full text-lg text-center tracking-wide',
                error && 'ring-2 ring-destructive'
              )}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive mt-2 text-center">{error}</p>
            )}
          </div>

          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !phone}
            className={cn(
              'tg-button-primary w-full flex items-center justify-center gap-2',
              (isLoading || !phone) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Продолжить'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

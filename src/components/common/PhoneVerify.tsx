import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';

export const PhoneVerify: React.FC = () => {
  const { role, completeRegistration } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +7 XXX XXX-XX-XX
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} ${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const isValidPhone = phone.replace(/\D/g, '').length >= 11;

  const handleSubmit = async () => {
    if (!isValidPhone || !role) return;

    hapticFeedback.medium();
    setIsLoading(true);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    completeRegistration(role, phone);
    hapticFeedback.success();

    // Navigate to role dashboard
    switch (role) {
      case 'seller':
        navigate('/seller');
        break;
      case 'customer':
        navigate('/customer');
        break;
      case 'technician':
        navigate('/technician');
        break;
      default:
        navigate('/');
    }
  };

  const handleBack = () => {
    hapticFeedback.light();
    navigate('/');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'seller': return 'Продавец';
      case 'customer': return 'Покупатель';
      case 'technician': return 'Мастер';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg active:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm text-muted-foreground">{getRoleLabel()}</span>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce-in">
          <Phone className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-xl font-bold text-center mb-2 animate-fade-in">
          Подтвердите номер
        </h1>
        <p className="text-muted-foreground text-center text-sm mb-8 animate-fade-in">
          Введите ваш номер телефона для регистрации
        </p>

        {/* Phone input */}
        <div className="animate-slide-up">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Номер телефона
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 999 123-45-67"
            className="tg-input w-full text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="p-4 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!isValidPhone || isLoading}
          className={cn(
            'tg-button-primary w-full flex items-center justify-center gap-2',
            (!isValidPhone || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              Продолжить
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

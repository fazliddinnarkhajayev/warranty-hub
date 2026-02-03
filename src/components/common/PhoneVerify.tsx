import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { hapticFeedback } from '@/lib/telegram';
import { formatUzbekPhone, isValidUzbekPhone, UZBEK_PHONE_PLACEHOLDER } from '@/lib/phoneUtils';
import { cn } from '@/lib/utils';

export const PhoneVerify: React.FC = () => {
  const { role, completeRegistration } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    if (!isValidUzbekPhone(phone) || !role) return;

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
            placeholder={UZBEK_PHONE_PLACEHOLDER}
            className="tg-input w-full text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="p-4 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!isValidUzbekPhone(phone) || isLoading}
          className={cn(
            'tg-button-primary w-full flex items-center justify-center gap-2',
            (!isValidUzbekPhone(phone) || isLoading) && 'opacity-50 cursor-not-allowed'
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

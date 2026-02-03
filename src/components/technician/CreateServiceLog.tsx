import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Phone, AlertCircle, CheckCircle, Banknote, Check } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';

export const CreateServiceLog: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    customer_name: '',
    customer_phone: '',
    problem: '',
    solution: '',
    is_warranty: true,
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} ${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, customer_phone: formatted }));
  };

  const toggleWarranty = () => {
    hapticFeedback.selection();
    setFormData(prev => ({ ...prev, is_warranty: !prev.is_warranty, price: prev.is_warranty ? '' : '0' }));
  };

  const isValid = formData.product_name && formData.customer_name && formData.problem && formData.customer_phone.replace(/\D/g, '').length >= 11;

  const handleSubmit = async () => {
    if (!isValid) return;

    hapticFeedback.medium();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    hapticFeedback.success();
    setIsLoading(false);
    navigate('/technician/jobs');
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Новая заявка" showBack />

      <div className="p-4 space-y-4 pb-32">
        {/* Product name */}
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Название устройства
          </label>
          <div className="relative">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="iPhone 15 Pro"
              className="tg-input w-full pl-12"
            />
          </div>
        </div>

        {/* Customer name */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Имя клиента
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Александр Петров"
              className="tg-input w-full pl-12"
            />
          </div>
        </div>

        {/* Customer phone */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Телефон клиента
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handlePhoneChange}
              placeholder="+7 999 123-45-67"
              className="tg-input w-full pl-12"
            />
          </div>
        </div>

        {/* Problem */}
        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Описание проблемы
          </label>
          <div className="relative">
            <AlertCircle className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="Опишите неисправность..."
              rows={3}
              className="tg-input w-full pl-12 pt-3 resize-none"
            />
          </div>
        </div>

        {/* Warranty toggle */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Тип ремонта
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={toggleWarranty}
              className={cn(
                'tg-card flex items-center justify-center gap-2 py-4 transition-all',
                formData.is_warranty ? 'ring-2 ring-primary bg-primary/5' : ''
              )}
            >
              <CheckCircle className={cn('w-5 h-5', formData.is_warranty ? 'text-primary' : 'text-muted-foreground')} />
              <span className={formData.is_warranty ? 'font-medium' : ''}>Гарантия</span>
            </button>
            <button
              type="button"
              onClick={toggleWarranty}
              className={cn(
                'tg-card flex items-center justify-center gap-2 py-4 transition-all',
                !formData.is_warranty ? 'ring-2 ring-primary bg-primary/5' : ''
              )}
            >
              <Banknote className={cn('w-5 h-5', !formData.is_warranty ? 'text-primary' : 'text-muted-foreground')} />
              <span className={!formData.is_warranty ? 'font-medium' : ''}>Платный</span>
            </button>
          </div>
        </div>

        {/* Price (if not warranty) */}
        {!formData.is_warranty && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Стоимость ремонта (₽)
            </label>
            <div className="relative">
              <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                className="tg-input w-full pl-12"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pt-8">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={cn(
            'tg-button-primary w-full flex items-center justify-center gap-2',
            (!isValid || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Создать заявку
            </>
          )}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

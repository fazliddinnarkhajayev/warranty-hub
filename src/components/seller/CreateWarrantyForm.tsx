import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Hash, User, Phone, Calendar, Check } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';

export const CreateWarrantyForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    serial_number: '',
    customer_name: '',
    customer_phone: '',
    warranty_period: '12',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const isValid = formData.product_name && formData.serial_number && formData.customer_name && formData.customer_phone.replace(/\D/g, '').length >= 11;

  const handleSubmit = async () => {
    if (!isValid) return;

    hapticFeedback.medium();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    hapticFeedback.success();
    setIsLoading(false);
    navigate('/seller/warranties');
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Новая гарантия" showBack />

      <div className="p-4 space-y-4">
        {/* Product name */}
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Название товара
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

        {/* Serial number */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Серийный номер
          </label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="DMPXK3JKXK"
              className="tg-input w-full pl-12 uppercase"
            />
          </div>
        </div>

        {/* Customer name */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Имя покупателя
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
        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Телефон покупателя
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

        {/* Warranty period */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Срок гарантии
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              name="warranty_period"
              value={formData.warranty_period}
              onChange={handleChange}
              className="tg-input w-full pl-12 appearance-none"
            >
              <option value="6">6 месяцев</option>
              <option value="12">12 месяцев</option>
              <option value="24">24 месяца</option>
              <option value="36">36 месяцев</option>
            </select>
          </div>
        </div>
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
              Создать гарантию
            </>
          )}
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

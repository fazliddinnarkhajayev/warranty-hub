import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, User, Phone, Calendar, Check, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { useProductByCode, useCreateWarranty } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { formatUzbekPhone, isValidUzbekPhone, UZBEK_PHONE_PLACEHOLDER } from '@/lib/phoneUtils';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export const CreateWarrantyForm: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [productCode, setProductCode] = useState('');
  const [debouncedCode, setDebouncedCode] = useState('');
  const [formData, setFormData] = useState({
    serial_number: '',
    customer_name: '',
    customer_phone: '',
    warranty_period: 12,
  });

  const { data: product, isLoading: productLoading, error: productError } = useProductByCode(debouncedCode);
  const createWarranty = useCreateWarranty();

  // Debounce product code
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productCode.length >= 3) {
        setDebouncedCode(productCode.toUpperCase());
      } else {
        setDebouncedCode('');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [productCode]);

  // Haptic feedback on product found/error
  useEffect(() => {
    if (product) hapticFeedback.success();
    if (productError) hapticFeedback.error();
  }, [product, productError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setFormData(prev => ({ ...prev, customer_phone: formatted }));
  };

  const isValid = product && formData.serial_number && formData.customer_name && isValidUzbekPhone(formData.customer_phone);

  const handleSubmit = async () => {
    if (!isValid || !product) return;

    hapticFeedback.medium();

    try {
      await createWarranty.mutateAsync({
        product_code: product.code,
        serial_number: formData.serial_number.toUpperCase(),
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        warranty_period: Number(formData.warranty_period),
      });

      hapticFeedback.success();
      navigate('/seller/warranties');
    } catch (error) {
      hapticFeedback.error();
    }
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('new_warranty')} showBack />

      <div className="p-4 space-y-4 pb-32">
        {/* Product code lookup */}
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            {t('product_code')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value.toUpperCase())}
              placeholder="IP15PRO"
              className={cn(
                'tg-input w-full uppercase',
                product && 'ring-2 ring-success',
                productError && 'ring-2 ring-destructive'
              )}
            />
            {productLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}
          </div>
          
          {/* Product info */}
          {product && (
            <div className="mt-3 p-3 bg-success/10 rounded-xl border border-success/20 animate-fade-in">
              <p className="font-medium text-success">{product.name}</p>
              {product.category && (
                <p className="text-sm text-muted-foreground">{product.category}</p>
              )}
            </div>
          )}
          
          {/* Error */}
          {productError && debouncedCode && (
            <div className="mt-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20 animate-fade-in flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{t('product_not_found')}</p>
            </div>
          )}
        </div>

        {/* Serial number - only show after product found */}
        {product && (
          <div className="animate-slide-up">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('serial_number')}
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
        )}

        {/* Customer name */}
        {product && (
          <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('customer_name')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Имя Фамилия"
                className="tg-input w-full pl-12"
              />
            </div>
          </div>
        )}

        {/* Customer phone */}
        {product && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('customer_phone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handlePhoneChange}
                placeholder={UZBEK_PHONE_PLACEHOLDER}
                className="tg-input w-full pl-12"
              />
            </div>
          </div>
        )}

        {/* Warranty period */}
        {product && (
          <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('warranty_period')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                name="warranty_period"
                value={formData.warranty_period}
                onChange={handleChange}
                className="tg-input w-full pl-12 appearance-none"
              >
                <option value="6">6 {t('months')}</option>
                <option value="12">12 {t('months')}</option>
                <option value="24">24 {t('months')}</option>
                <option value="36">36 {t('months')}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      {product && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pt-8">
          <button
            onClick={handleSubmit}
            disabled={!isValid || createWarranty.isPending}
            className={cn(
              'tg-button-primary w-full flex items-center justify-center gap-2',
              (!isValid || createWarranty.isPending) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {createWarranty.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                {t('create_warranty')}
              </>
            )}
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

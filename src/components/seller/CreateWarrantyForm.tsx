import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Check, Loader2, AlertCircle } from 'lucide-react';
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
  const { user } = useApp();

  const [productCode, setProductCode] = useState('');
  const [debouncedCode, setDebouncedCode] = useState('');
  const [phone, setPhone] = useState('');

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzbekPhone(e.target.value);
    setPhone(formatted);
  };

  const isValid = product && isValidUzbekPhone(phone);

  const handleSubmit = async () => {
    if (!isValid || !product) return;

    hapticFeedback.medium();

    try {
      await createWarranty.mutateAsync({
        product_id: product.id,
        phone: phone,
        seller_id: String(user?.id || ''),
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

        {/* Customer phone */}
        {product && (
          <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('customer_phone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder={UZBEK_PHONE_PLACEHOLDER}
                className="tg-input w-full pl-12"
              />
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

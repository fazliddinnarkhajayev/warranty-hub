import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Banknote, Check, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { useWarrantyBySerial, useCreateService } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export const CreateServiceLog: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const [serialNumber, setSerialNumber] = useState('');
  const [debouncedSerial, setDebouncedSerial] = useState('');
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    is_warranty: false,
    price: '',
  });

  const { data: warrantyCheck, isLoading: checkLoading, error: checkError } = useWarrantyBySerial(debouncedSerial);
  const createService = useCreateService();

  // Debounce serial number
  useEffect(() => {
    const timer = setTimeout(() => {
      if (serialNumber.length >= 5) {
        setDebouncedSerial(serialNumber.toUpperCase());
      } else {
        setDebouncedSerial('');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [serialNumber]);

  // Auto-set warranty toggle
  useEffect(() => {
    if (warrantyCheck) {
      const isActive = warrantyCheck.warranty_status === 'active';
      setFormData(prev => ({
        ...prev,
        is_warranty: isActive,
        price: isActive ? '0' : '',
      }));
      hapticFeedback.success();
    }
    if (checkError) hapticFeedback.error();
  }, [warrantyCheck, checkError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleWarranty = () => {
    if (warrantyCheck?.warranty_status !== 'active') return;
    hapticFeedback.selection();
    setFormData(prev => ({
      ...prev,
      is_warranty: !prev.is_warranty,
      price: prev.is_warranty ? '' : '0',
    }));
  };

  const isValid = warrantyCheck?.product && formData.problem;

  const handleSubmit = async () => {
    if (!isValid) return;
    hapticFeedback.medium();

    try {
      await createService.mutateAsync({
        serial_number: debouncedSerial,
        problem: formData.problem,
        solution: formData.solution,
        is_warranty: formData.is_warranty,
        price: Number(formData.price) || 0,
      });
      hapticFeedback.success();
      navigate('/technician/jobs');
    } catch {
      hapticFeedback.error();
    }
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('new_service')} showBack />

      <div className="p-4 space-y-4 pb-32">
        {/* Serial lookup */}
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            {t('serial_number')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
              placeholder="DMPXK3JKXK"
              className={cn(
                'tg-input w-full uppercase',
                warrantyCheck && 'ring-2 ring-success',
                checkError && 'ring-2 ring-destructive'
              )}
            />
            {checkLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}
          </div>

          {warrantyCheck?.product && (
            <div className={cn(
              'mt-3 p-3 rounded-xl border animate-fade-in',
              warrantyCheck.warranty_status === 'active'
                ? 'bg-success/10 border-success/20'
                : 'bg-warning/10 border-warning/20'
            )}>
              <p className="font-medium">{warrantyCheck.product.name}</p>
              <p className={cn(
                'text-sm',
                warrantyCheck.warranty_status === 'active' ? 'text-success' : 'text-warning'
              )}>
                {warrantyCheck.warranty_status === 'active' ? t('status_active') : t('status_expired')}
              </p>
            </div>
          )}

          {checkError && debouncedSerial && (
            <div className="mt-3 p-3 bg-destructive/10 rounded-xl border border-destructive/20 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{t('product_not_found')}</p>
            </div>
          )}
        </div>

        {warrantyCheck?.product && (
          <>
            {/* Problem */}
            <div className="animate-slide-up">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                {t('problem')}
              </label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                placeholder="Опишите неисправность..."
                rows={3}
                className="tg-input w-full resize-none"
              />
            </div>

            {/* Warranty toggle */}
            <div className="animate-slide-up">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Тип ремонта
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleWarranty}
                  disabled={warrantyCheck.warranty_status !== 'active'}
                  className={cn(
                    'tg-card flex items-center justify-center gap-2 py-4',
                    formData.is_warranty && 'ring-2 ring-primary bg-primary/5',
                    warrantyCheck.warranty_status !== 'active' && 'opacity-50'
                  )}
                >
                  <CheckCircle className={cn('w-5 h-5', formData.is_warranty ? 'text-primary' : 'text-muted-foreground')} />
                  <span>{t('warranty_repair')}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleWarranty}
                  disabled={warrantyCheck.warranty_status !== 'active'}
                  className={cn(
                    'tg-card flex items-center justify-center gap-2 py-4',
                    !formData.is_warranty && 'ring-2 ring-primary bg-primary/5'
                  )}
                >
                  <Banknote className={cn('w-5 h-5', !formData.is_warranty ? 'text-primary' : 'text-muted-foreground')} />
                  <span>{t('paid_repair')}</span>
                </button>
              </div>
            </div>

            {/* Price */}
            {!formData.is_warranty && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  {t('repair_cost')} (сум)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="500000"
                  className="tg-input w-full"
                />
              </div>
            )}
          </>
        )}
      </div>

      {warrantyCheck?.product && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent pt-8">
          <button
            onClick={handleSubmit}
            disabled={!isValid || createService.isPending}
            className={cn(
              'tg-button-primary w-full flex items-center justify-center gap-2',
              (!isValid || createService.isPending) && 'opacity-50'
            )}
          >
            {createService.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                {t('create_service')}
              </>
            )}
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

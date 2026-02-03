import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Banknote, Check } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { ProductCodeInput } from '@/components/common/ProductCodeInput';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';
import { type ProductLookupResult } from '@/lib/productLookup';

export const CreateServiceLog: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [productFound, setProductFound] = useState(false);
  const [warrantyInfo, setWarrantyInfo] = useState<ProductLookupResult['product'] | null>(null);
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    is_warranty: false,
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWarrantyFound = (result: ProductLookupResult['product']) => {
    if (result) {
      setProductFound(true);
      setWarrantyInfo(result);
      // Auto-set warranty toggle based on warranty status
      const isWarrantyActive = result.warranty_status === 'active';
      setFormData(prev => ({ 
        ...prev, 
        is_warranty: isWarrantyActive,
        price: isWarrantyActive ? '0' : ''
      }));
    }
  };

  const handleProductError = () => {
    setProductFound(false);
    setWarrantyInfo(null);
  };

  const handleProductClear = () => {
    setProductFound(false);
    setWarrantyInfo(null);
    setFormData(prev => ({ ...prev, is_warranty: false, price: '' }));
  };

  const toggleWarranty = () => {
    // Only allow toggling if warranty is active
    if (warrantyInfo?.warranty_status !== 'active') return;
    
    hapticFeedback.selection();
    setFormData(prev => ({ 
      ...prev, 
      is_warranty: !prev.is_warranty, 
      price: prev.is_warranty ? '' : '0' 
    }));
  };

  const isValid = productFound && warrantyInfo && formData.problem;

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
        {/* Serial number lookup */}
        <div className="animate-fade-in">
          <ProductCodeInput
            mode="warranty"
            value={serialNumber}
            onChange={setSerialNumber}
            onWarrantyFound={handleWarrantyFound}
            onError={handleProductError}
            onClear={handleProductClear}
            label="Серийный номер"
            placeholder="DMPXK3JKXK"
          />
        </div>

        {/* Problem description - only show after product found */}
        {productFound && warrantyInfo && (
          <>
            <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
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

            {/* Warranty toggle - only if warranty is active */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Тип ремонта
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleWarranty}
                  disabled={warrantyInfo.warranty_status !== 'active'}
                  className={cn(
                    'tg-card flex items-center justify-center gap-2 py-4 transition-all',
                    formData.is_warranty ? 'ring-2 ring-primary bg-primary/5' : '',
                    warrantyInfo.warranty_status !== 'active' && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <CheckCircle className={cn('w-5 h-5', formData.is_warranty ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={formData.is_warranty ? 'font-medium' : ''}>Гарантия</span>
                </button>
                <button
                  type="button"
                  onClick={toggleWarranty}
                  disabled={warrantyInfo.warranty_status !== 'active'}
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
                  Стоимость ремонта (сум)
                </label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="500000"
                    className="tg-input w-full pl-12"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Submit button */}
      {productFound && (
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
      )}

      <BottomNav />
    </div>
  );
};

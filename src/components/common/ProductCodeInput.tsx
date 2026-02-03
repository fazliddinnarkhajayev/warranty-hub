import React, { useState, useCallback } from 'react';
import { Hash, Loader2, CheckCircle, XCircle, ShieldCheck, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { lookupProductByCode, lookupWarrantyBySerialOrCode, type ProductLookupResult } from '@/lib/productLookup';
import { hapticFeedback } from '@/lib/telegram';

interface ProductCodeInputProps {
  mode: 'product' | 'warranty';
  value: string;
  onChange: (value: string) => void;
  onProductFound?: (product: { name: string; category?: string }) => void;
  onWarrantyFound?: (result: ProductLookupResult['product']) => void;
  onError?: (error: string) => void;
  onClear?: () => void;
  className?: string;
  placeholder?: string;
  label?: string;
}

export const ProductCodeInput: React.FC<ProductCodeInputProps> = ({
  mode,
  value,
  onChange,
  onProductFound,
  onWarrantyFound,
  onError,
  onClear,
  className,
  placeholder,
  label,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'found' | 'not_found'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [foundInfo, setFoundInfo] = useState<{
    name: string;
    category?: string;
    warranty_status?: 'active' | 'expired';
    customer_name?: string;
  } | null>(null);

  const handleLookup = useCallback(async () => {
    if (!value.trim()) {
      setLookupStatus('idle');
      setFoundInfo(null);
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    hapticFeedback.light();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (mode === 'product') {
      const result = lookupProductByCode(value);
      
      if (result.found && result.name) {
        setLookupStatus('found');
        setFoundInfo({ name: result.name, category: result.category });
        setErrorMessage('');
        onProductFound?.({ name: result.name, category: result.category });
        hapticFeedback.success();
      } else {
        setLookupStatus('not_found');
        setFoundInfo(null);
        setErrorMessage(result.error || 'Товар не найден');
        onError?.(result.error || 'Товар не найден');
        hapticFeedback.error();
      }
    } else {
      const result = lookupWarrantyBySerialOrCode(value);
      
      if (result.found && result.product) {
        setLookupStatus('found');
        setFoundInfo({
          name: result.product.name,
          warranty_status: result.product.warranty_status === 'active' ? 'active' : 'expired',
          customer_name: result.product.customer_name,
        });
        setErrorMessage('');
        onWarrantyFound?.(result.product);
        hapticFeedback.success();
      } else {
        setLookupStatus('not_found');
        setFoundInfo(null);
        setErrorMessage(result.error || 'Гарантия не найдена');
        onError?.(result.error || 'Гарантия не найдена');
        hapticFeedback.error();
      }
    }

    setIsLoading(false);
  }, [value, mode, onProductFound, onWarrantyFound, onError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
    
    // Reset status when typing
    if (lookupStatus !== 'idle') {
      setLookupStatus('idle');
      setFoundInfo(null);
      setErrorMessage('');
      onClear?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium mb-2 text-muted-foreground">
        {label || (mode === 'product' ? 'Код товара' : 'Серийный номер')}
      </label>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || (mode === 'product' ? 'IP15PRO' : 'DMPXK3JKXK')}
            className={cn(
              'tg-input w-full pl-12 pr-12 uppercase',
              lookupStatus === 'found' && 'ring-2 ring-success',
              lookupStatus === 'not_found' && 'ring-2 ring-destructive'
            )}
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
          )}
          {!isLoading && lookupStatus === 'found' && (
            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
          )}
          {!isLoading && lookupStatus === 'not_found' && (
            <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
          )}
        </div>
        
        <button
          type="button"
          onClick={handleLookup}
          disabled={!value.trim() || isLoading}
          className={cn(
            'tg-button-primary px-4 whitespace-nowrap',
            (!value.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          Найти
        </button>
      </div>

      {/* Error message */}
      {lookupStatus === 'not_found' && errorMessage && (
        <div className="flex items-center gap-2 text-sm text-destructive animate-fade-in p-3 bg-destructive/10 rounded-lg">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Found product info */}
      {lookupStatus === 'found' && foundInfo && (
        <div className="tg-card animate-fade-in !p-3 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{foundInfo.name}</p>
              {foundInfo.category && (
                <p className="text-sm text-muted-foreground">{foundInfo.category}</p>
              )}
            </div>
          </div>
          
          {/* Warranty status for technician mode */}
          {mode === 'warranty' && foundInfo.warranty_status && (
            <div className={cn(
              'flex items-center gap-2 p-2 rounded-lg',
              foundInfo.warranty_status === 'active' 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            )}>
              {foundInfo.warranty_status === 'active' ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">Гарантия активна</span>
                </>
              ) : (
                <>
                  <ShieldX className="w-5 h-5" />
                  <span className="text-sm font-medium">Гарантия истекла</span>
                </>
              )}
            </div>
          )}
          
          {foundInfo.customer_name && (
            <p className="text-sm text-muted-foreground">
              Клиент: {foundInfo.customer_name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

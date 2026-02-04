import React from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Calendar, User, Wrench, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import { useWarranty } from '@/hooks/useApi';
import { getTranslation } from '@/lib/i18n';

export const WarrantyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const { data: warranty, isLoading, error } = useWarranty(id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  if (isLoading) {
    return (
      <div className="tg-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !warranty) {
    return (
      <div className="tg-screen bg-background">
        <Header title={t('warranties')} showBack />
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-lg font-medium">{t('warranty_not_found')}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="tg-screen bg-background">
      <Header title={warranty.product_name} showBack />

      <div className="p-4 space-y-4">
        {/* Product card */}
        <div className="tg-card animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-lg font-semibold">{warranty.product_name}</h2>
                <StatusBadge status={warranty.status} />
              </div>
              <p className="text-sm text-muted-foreground">S/N: {warranty.serial_number}</p>
            </div>
          </div>
        </div>

        {/* Warranty dates */}
        <div className="animate-slide-up">
          <p className="tg-section-header">{t('warranty_period')}</p>
          <div className="tg-card space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Начало</p>
                <p className="font-medium">{formatDate(warranty.start_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Окончание</p>
                <p className="font-medium">{formatDate(warranty.expiry_date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service history */}
        {warranty.services && warranty.services.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <p className="tg-section-header">{t('technical_services')}</p>
            <div className="space-y-3">
              {warranty.services.map((service) => (
                <div key={service.id} className="tg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{service.problem}</p>
                      {service.solution && (
                        <p className="text-sm text-muted-foreground">{service.solution}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(service.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

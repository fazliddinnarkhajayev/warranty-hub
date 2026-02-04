import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import { useServices } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';

export const CustomerServices: React.FC = () => {
  const navigate = useNavigate();
  const { user, language } = useApp();
  
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const { data: services, isLoading } = useServices({ 
    customer_id: user?.id 
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US'
    ).format(price);
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('technical_services')} showBack />

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="tg-card-interactive animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  hapticFeedback.light();
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold truncate">{service.product_name}</h3>
                      <StatusBadge status={service.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {service.problem}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(service.created_at)}</span>
                      {!service.is_warranty && service.price > 0 && (
                        <span className="font-medium text-foreground">
                          {formatPrice(service.price)} сум
                        </span>
                      )}
                      {service.is_warranty && (
                        <span className="text-success font-medium">
                          {t('warranty_repair')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tg-card text-center py-12">
            <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

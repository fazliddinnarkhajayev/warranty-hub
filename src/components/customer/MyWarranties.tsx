import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import { useWarranties } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';

export const MyWarranties: React.FC = () => {
  const navigate = useNavigate();
  const { user, language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const { data: warranties, isLoading } = useWarranties({
    customer_id: user?.id?.toString(),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('all_warranties')} showBack />

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : warranties && warranties.length > 0 ? (
          <div className="space-y-3">
            {warranties.map((warranty, index) => (
              <div
                key={warranty.id}
                className="tg-card-interactive animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  hapticFeedback.light();
                  navigate(`/customer/warranty/${warranty.id}`);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold truncate">{warranty.product_name}</h3>
                      <StatusBadge status={warranty.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('serial_number')}: {warranty.serial_number}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{formatDate(warranty.start_date)}</span>
                      <span>→ {formatDate(warranty.expiry_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tg-card text-center py-12">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

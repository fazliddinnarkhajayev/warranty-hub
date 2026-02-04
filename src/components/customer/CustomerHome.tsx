import React from 'react';
import { ShieldCheck, Phone, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useCustomerStats, useWarranties } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';

export const CustomerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, language } = useApp();
  
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useCustomerStats(user?.id);
  const { data: warranties, isLoading: warrantiesLoading } = useWarranties({ 
    customer_id: user?.id 
  });

  const myWarranties = warranties?.slice(0, 3) || [];

  const handleViewAll = () => {
    hapticFeedback.light();
    navigate('/customer/warranties');
  };

  if (statsLoading) {
    return (
      <div className="tg-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="tg-screen bg-background">
        <Header title={t('my_warranties')} />
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-lg font-medium">{t('error')}</p>
          <button
            onClick={() => window.location.reload()}
            className="tg-button-primary mt-4"
          >
            {t('retry')}
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="tg-screen bg-background">
      <Header title={t('my_warranties')} />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold">{t('welcome')}, {user?.firstname}! 👋</h2>
          <p className="text-muted-foreground text-sm">
            {stats?.active_warranties || 0} {t('active_warranties').toLowerCase()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="tg-stat">
            <div className="tg-stat-value text-primary">{stats?.total_warranties || 0}</div>
            <div className="tg-stat-label">{t('warranties')}</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-success">{stats?.active_warranties || 0}</div>
            <div className="tg-stat-label">{t('status_active')}</div>
          </div>
        </div>

        {/* Warranties list */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="tg-section-header">{t('warranties')}</p>
            <button
              onClick={handleViewAll}
              className="text-sm text-primary font-medium px-4"
            >
              {t('all')}
            </button>
          </div>
          
          {warrantiesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : myWarranties.length > 0 ? (
            <div className="space-y-3">
              {myWarranties.map((warranty) => (
                <div
                  key={warranty.id}
                  className="tg-card-interactive"
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
                      <p className="text-sm text-muted-foreground">
                        S/N: {warranty.serial_number}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(warranty.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tg-card text-center py-8">
              <p className="text-muted-foreground">{t('empty')}</p>
            </div>
          )}
        </div>

        {/* Help section */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="tg-section-header">{t('need_help')}</p>
          <div className="tg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t('contact_support')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

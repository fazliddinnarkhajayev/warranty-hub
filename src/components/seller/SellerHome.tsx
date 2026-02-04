import React from 'react';
import { Plus, FileText, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useSellerStats, useWarranties } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';

export const SellerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, language } = useApp();
  
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useSellerStats(user?.id);
  const { data: warranties, isLoading: warrantiesLoading } = useWarranties({ 
    seller_id: user?.id 
  });

  const recentWarranties = warranties?.slice(0, 3) || [];

  const handleQuickAction = (path: string) => {
    hapticFeedback.light();
    navigate(path);
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
        <Header title="Warranty Bot" />
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
      <Header title="Warranty Bot" />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold">{t('welcome')}, {user?.firstname}! 👋</h2>
          <p className="text-muted-foreground text-sm">{t('this_month')}: {stats?.this_month || 0}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="tg-stat">
            <div className="tg-stat-value text-primary">{stats?.active_warranties || 0}</div>
            <div className="tg-stat-label">{t('active_warranties')}</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-success">{stats?.this_month || 0}</div>
            <div className="tg-stat-label">{t('this_month')}</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">{t('create')}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAction('/seller/create')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">{t('new_warranty')}</span>
            </button>
            <button
              onClick={() => handleQuickAction('/seller/warranties')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-medium">{t('all_warranties')}</span>
            </button>
          </div>
        </div>

        {/* Recent warranties */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="tg-section-header">{t('recent_warranties')}</p>
            <button
              onClick={() => handleQuickAction('/seller/warranties')}
              className="text-sm text-primary font-medium px-4"
            >
              {t('all')}
            </button>
          </div>
          
          {warrantiesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : recentWarranties.length > 0 ? (
            <div className="bg-card rounded-xl overflow-hidden border border-border/50">
              {recentWarranties.map((warranty) => (
                <div
                  key={warranty.id}
                  className="tg-list-item cursor-pointer"
                  onClick={() => hapticFeedback.light()}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{warranty.product_name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {warranty.customer_name}
                    </p>
                  </div>
                  <StatusBadge status={warranty.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="tg-card text-center py-8">
              <p className="text-muted-foreground">{t('empty')}</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

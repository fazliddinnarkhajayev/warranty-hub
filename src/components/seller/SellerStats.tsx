import React from 'react';
import { TrendingUp, ShieldCheck, Calendar, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { useSellerStats } from '@/hooks/useApi';
import { getTranslation } from '@/lib/i18n';

export const SellerStats: React.FC = () => {
  const { user, language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const { data: stats, isLoading } = useSellerStats(user?.id);

  if (isLoading) {
    return (
      <div className="tg-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="tg-screen bg-background">
      <Header title={t('statistics')} showBack />

      <div className="p-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <div className="tg-stat">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="tg-stat-value">{stats?.total_warranties || 0}</div>
            <div className="tg-stat-label">{t('warranties')}</div>
          </div>
          <div className="tg-stat">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="tg-stat-value text-success">{stats?.active_warranties || 0}</div>
            <div className="tg-stat-label">{t('status_active')}</div>
          </div>
        </div>

        {/* Period stats */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">{t('this_month')}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="tg-card text-center">
              <div className="text-2xl font-bold text-primary">{stats?.this_month || 0}</div>
              <div className="text-sm text-muted-foreground">{t('this_month')}</div>
            </div>
            <div className="tg-card text-center">
              <div className="text-2xl font-bold">{stats?.this_week || 0}</div>
              <div className="text-sm text-muted-foreground">На этой неделе</div>
            </div>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="tg-section-header">По статусам</p>
          <div className="tg-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>{t('status_active')}</span>
              </div>
              <span className="font-semibold">{stats?.by_status?.active || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>{t('status_expired')}</span>
              </div>
              <span className="font-semibold">{stats?.by_status?.expired || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>{t('status_pending')}</span>
              </div>
              <span className="font-semibold">{stats?.by_status?.pending || 0}</span>
            </div>
          </div>
        </div>

        {/* Monthly trend */}
        {stats?.monthly_trend && stats.monthly_trend.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <p className="tg-section-header">По месяцам</p>
            <div className="tg-card">
              <div className="space-y-3">
                {stats.monthly_trend.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">{item.month}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

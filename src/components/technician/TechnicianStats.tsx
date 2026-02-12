import React from 'react';
import { Wrench, TrendingUp, CheckCircle, Clock, ShieldCheck, Banknote, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { useTechnicianStats } from '@/hooks/useApi';
import { getTranslation } from '@/lib/i18n';

export const TechnicianStats: React.FC = () => {
  const { user, language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const { data: stats, isLoading } = useTechnicianStats(user?.id?.toString());

  if (isLoading) {
    return (
      <div className="tg-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalJobs = stats?.total_services || 0;
  const completedJobs = stats?.completed_services || 0;

  const statCards = [
    { icon: Wrench, label: t('all_services'), value: totalJobs, color: 'text-primary', bgColor: 'bg-primary/10' },
    { icon: CheckCircle, label: t('completed'), value: completedJobs, color: 'text-success', bgColor: 'bg-success/10' },
    { icon: Clock, label: t('in_progress'), value: (stats?.in_progress_services || 0) + (stats?.pending_services || 0), color: 'text-warning', bgColor: 'bg-warning/10' },
    { icon: ShieldCheck, label: t('warranty_repair'), value: stats?.warranty_repairs || 0, color: 'text-primary', bgColor: 'bg-primary/10' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US').format(price);
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('statistics')} showBack />

      <div className="p-4 space-y-6">
        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="tg-card animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Earnings card */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="tg-section-header">Заработок</p>
          <div className="tg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatPrice(stats?.total_earnings || 0)} сум
                </p>
                <p className="text-sm text-muted-foreground">{t('paid_repair')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        {totalJobs > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <p className="tg-section-header">{t('statistics')}</p>
            <div className="tg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold">{completedJobs} / {totalJobs}</p>
                  <p className="text-sm text-muted-foreground">{t('completed')}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('completed')}</span>
                  <span className="font-medium">{Math.round((completedJobs / totalJobs) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${(completedJobs / totalJobs) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

import React from 'react';
import { Plus, FileText, TrendingUp, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { getSellerStats, mockWarranties } from '@/lib/mockData';
import { hapticFeedback } from '@/lib/telegram';
import { StatusBadge } from '@/components/common/StatusBadge';

export const SellerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const stats = getSellerStats();
  const recentWarranties = mockWarranties.slice(0, 3);

  const handleQuickAction = (path: string) => {
    hapticFeedback.light();
    navigate(path);
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Warranty Bot" />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold">Привет, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-muted-foreground text-sm">Сегодня отличный день для продаж</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="tg-stat">
            <div className="tg-stat-value text-primary">{stats.activeWarranties}</div>
            <div className="tg-stat-label">Активных гарантий</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-success">{stats.thisMonth}</div>
            <div className="tg-stat-label">За этот месяц</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">Быстрые действия</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAction('/seller/create')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">Новая гарантия</span>
            </button>
            <button
              onClick={() => handleQuickAction('/seller/warranties')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-medium">Все гарантии</span>
            </button>
          </div>
        </div>

        {/* Recent warranties */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="tg-section-header">Последние гарантии</p>
            <button
              onClick={() => handleQuickAction('/seller/warranties')}
              className="text-sm text-primary font-medium px-4"
            >
              Все
            </button>
          </div>
          <div className="bg-card rounded-xl overflow-hidden border border-border/50">
            {recentWarranties.map((warranty, index) => (
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
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

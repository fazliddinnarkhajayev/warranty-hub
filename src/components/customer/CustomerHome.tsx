import React from 'react';
import { ShieldCheck, History, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockWarranties } from '@/lib/mockData';
import { hapticFeedback } from '@/lib/telegram';

export const CustomerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  // In real app, filter by customer phone
  const myWarranties = mockWarranties.slice(0, 2);
  const activeCount = myWarranties.filter(w => w.status === 'active').length;

  const handleViewAll = () => {
    hapticFeedback.light();
    navigate('/customer/warranties');
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Мои гарантии" />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold">Привет, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-muted-foreground text-sm">
            У вас {activeCount} активных гарантий
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="tg-stat">
            <div className="tg-stat-value text-primary">{myWarranties.length}</div>
            <div className="tg-stat-label">Всего гарантий</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-success">{activeCount}</div>
            <div className="tg-stat-label">Активных</div>
          </div>
        </div>

        {/* Warranties list */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="tg-section-header">Ваши гарантии</p>
            <button
              onClick={handleViewAll}
              className="text-sm text-primary font-medium px-4"
            >
              Все
            </button>
          </div>
          
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
                      До: {new Date(warranty.expiry_date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help section */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="tg-section-header">Нужна помощь?</p>
          <div className="tg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Связаться с поддержкой</p>
                <p className="text-sm text-muted-foreground">Мы всегда готовы помочь</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockWarranties } from '@/lib/mockData';
import { hapticFeedback } from '@/lib/telegram';

export const MyWarranties: React.FC = () => {
  const navigate = useNavigate();
  // In real app, filter by customer phone
  const myWarranties = mockWarranties;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Все гарантии" showBack />

      <div className="p-4">
        <div className="space-y-3">
          {myWarranties.map((warranty, index) => (
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
                    Серийный номер: {warranty.serial_number}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span>Куплено: {formatDate(warranty.purchase_date)}</span>
                    <span>Гарантия до: {formatDate(warranty.expiry_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

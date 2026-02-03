import React from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, Calendar, User, Phone, Hash, Store, Clock, Wrench } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockWarranties, mockServiceLogs } from '@/lib/mockData';

export const WarrantyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const warranty = mockWarranties.find(w => w.id === id);
  const serviceLogs = mockServiceLogs.filter(s => s.warranty_id === id);

  if (!warranty) {
    return (
      <div className="tg-screen bg-background">
        <Header title="Гарантия" showBack />
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Гарантия не найдена
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(warranty.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="tg-screen bg-background">
      <Header title="Детали гарантии" showBack />

      <div className="p-4 space-y-4">
        {/* Product card */}
        <div className="tg-card animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{warranty.product_name}</h2>
              <p className="text-sm text-muted-foreground">S/N: {warranty.serial_number}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <StatusBadge status={warranty.status} />
            {warranty.status === 'active' && (
              <span className="text-sm text-muted-foreground">
                Осталось {daysLeft} дней
              </span>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="tg-card">
            <Calendar className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Дата покупки</p>
            <p className="font-medium text-sm">{formatDate(warranty.purchase_date)}</p>
          </div>
          <div className="tg-card">
            <Clock className="w-5 h-5 text-warning mb-2" />
            <p className="text-xs text-muted-foreground">Действует до</p>
            <p className="font-medium text-sm">{formatDate(warranty.expiry_date)}</p>
          </div>
        </div>

        {/* Seller info */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">Продавец</p>
          <div className="tg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{warranty.seller_name}</p>
                <p className="text-sm text-muted-foreground">Официальный продавец</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service history */}
        {serviceLogs.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <p className="tg-section-header">История обслуживания</p>
            <div className="space-y-3">
              {serviceLogs.map((log) => (
                <div key={log.id} className="tg-card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium">{log.problem}</p>
                        <StatusBadge status={log.status} />
                      </div>
                      {log.solution && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {log.solution}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(log.created_at)}</span>
                        {log.is_warranty ? (
                          <span className="text-success">По гарантии</span>
                        ) : (
                          <span>{log.price.toLocaleString('ru-RU')} ₽</span>
                        )}
                      </div>
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

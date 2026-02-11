import React, { useState } from 'react';
import { Search, ShieldCheck, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import { useWarranties } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'active' | 'expired' | 'pending';

export const SellerWarrantyList: React.FC = () => {
  const { user, language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: warranties, isLoading } = useWarranties({
    seller_id: user?.id?.toString(),
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  });

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: t('all') },
    { id: 'active', label: t('status_active') },
    { id: 'expired', label: t('status_expired') },
    { id: 'pending', label: t('status_pending') },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('all_warranties')} showBack />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="tg-input w-full pl-12"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide animate-slide-up">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => {
                hapticFeedback.selection();
                setStatusFilter(filter.id);
              }}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                statusFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* List */}
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
                onClick={() => hapticFeedback.light()}
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
                      {warranty.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      S/N: {warranty.serial_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(warranty.created_at)}
                    </p>
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

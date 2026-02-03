import React, { useState } from 'react';
import { Search, ShieldCheck, Filter } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockWarranties, Warranty } from '@/lib/mockData';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'active' | 'expired';

export const SellerWarrantyList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredWarranties = mockWarranties.filter(w => {
    const matchesSearch = 
      w.product_name.toLowerCase().includes(search.toLowerCase()) ||
      w.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      w.serial_number.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || w.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleFilterChange = (newFilter: FilterType) => {
    hapticFeedback.selection();
    setFilter(newFilter);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="tg-screen bg-background">
      <Header title="Все гарантии" showBack />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, имени, серийному номеру..."
            className="tg-input w-full pl-12"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide animate-slide-up">
          {(['all', 'active', 'expired'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {f === 'all' && 'Все'}
              {f === 'active' && 'Активные'}
              {f === 'expired' && 'Истёкшие'}
            </button>
          ))}
        </div>

        {/* Warranty list */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {filteredWarranties.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Гарантии не найдены</p>
            </div>
          ) : (
            filteredWarranties.map((warranty) => (
              <WarrantyCard key={warranty.id} warranty={warranty} />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

const WarrantyCard: React.FC<{ warranty: Warranty }> = ({ warranty }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className="tg-card-interactive"
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
          <p className="text-sm text-muted-foreground mb-2">
            {warranty.customer_name}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>S/N: {warranty.serial_number}</span>
            <span>До: {formatDate(warranty.expiry_date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

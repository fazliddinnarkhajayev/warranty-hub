import React, { useState } from 'react';
import { Wrench, Search, Loader2 } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useApp } from '@/contexts/AppContext';
import { useServices } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/api/types';

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed';

export const MyJobs: React.FC = () => {
  const { user, language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const { data: services, isLoading } = useServices({
    technician_id: user?.id?.toString(),
    status: filter !== 'all' ? filter : undefined,
    search: search || undefined,
  });

  const handleFilterChange = (newFilter: FilterType) => {
    hapticFeedback.selection();
    setFilter(newFilter);
  };

  return (
    <div className="tg-screen bg-background">
      <Header title={t('all_services')} showBack />

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

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide animate-slide-up">
          {(['all', 'pending', 'in_progress', 'completed'] as FilterType[]).map((f) => (
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
              {f === 'all' && t('all')}
              {f === 'pending' && t('pending')}
              {f === 'in_progress' && t('in_progress')}
              {f === 'completed' && t('completed')}
            </button>
          ))}
        </div>

        {/* Jobs list */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {!services || services.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>{t('empty')}</p>
              </div>
            ) : (
              services.map((job) => (
                <JobCard key={job.id} job={job} language={language} />
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

const JobCard: React.FC<{ job: Service; language: string }> = ({ job, language }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      { day: 'numeric', month: 'short' }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US'
    ).format(price);
  };

  return (
    <div
      className="tg-card-interactive"
      onClick={() => hapticFeedback.light()}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
          <Wrench className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold truncate">{job.product_name}</h3>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {job.problem}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{job.customer_name}</span>
            <span>{formatDate(job.created_at)}</span>
            {job.is_warranty ? (
              <span className="text-success">Гарантия</span>
            ) : (
              <span>{formatPrice(job.price)} сум</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

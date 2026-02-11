import React from 'react';
import { Wrench, Plus, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useTechnicianStats, useServices } from '@/hooks/useApi';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';

export const TechnicianHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, language } = useApp();
  
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useTechnicianStats(user?.id?.toString());
  const { data: services, isLoading: servicesLoading } = useServices({ 
    technician_id: user?.id?.toString() 
  });

  const pendingJobs = services?.filter(j => j.status === 'pending' || j.status === 'in_progress').slice(0, 3) || [];

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
          <h2 className="text-xl font-bold">{t('welcome')}, {user?.first_name}! 🔧</h2>
          <p className="text-muted-foreground text-sm">
            {(stats?.pending_services || 0) + (stats?.in_progress_services || 0)} {t('active_jobs').toLowerCase()}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 animate-slide-up">
          <div className="tg-stat">
            <div className="tg-stat-value text-warning">{stats?.pending_services || 0}</div>
            <div className="tg-stat-label text-xs">{t('pending')}</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-primary">{stats?.in_progress_services || 0}</div>
            <div className="tg-stat-label text-xs">{t('in_progress')}</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-success">{stats?.completed_services || 0}</div>
            <div className="tg-stat-label text-xs">{t('completed')}</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">{t('create')}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAction('/technician/create')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">{t('new_service')}</span>
            </button>
            <button
              onClick={() => handleQuickAction('/technician/jobs')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-medium">{t('all_services')}</span>
            </button>
          </div>
        </div>

        {/* Pending jobs */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="tg-section-header">{t('active_jobs')}</p>
            <button
              onClick={() => handleQuickAction('/technician/jobs')}
              className="text-sm text-primary font-medium px-4"
            >
              {t('all')}
            </button>
          </div>
          
          {servicesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : pendingJobs.length > 0 ? (
            <div className="bg-card rounded-xl overflow-hidden border border-border/50">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="tg-list-item cursor-pointer"
                  onClick={() => hapticFeedback.light()}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{job.product_name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {job.problem}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
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

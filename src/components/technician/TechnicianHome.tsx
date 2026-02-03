import React from 'react';
import { Wrench, Plus, ClipboardList, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getTechnicianStats, mockServiceLogs } from '@/lib/mockData';
import { hapticFeedback } from '@/lib/telegram';

export const TechnicianHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const stats = getTechnicianStats();
  const pendingJobs = mockServiceLogs.filter(j => j.status === 'pending' || j.status === 'in_progress').slice(0, 3);

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
          <h2 className="text-xl font-bold">Привет, {user?.name?.split(' ')[0]}! 🔧</h2>
          <p className="text-muted-foreground text-sm">
            У вас {stats.pendingJobs + stats.inProgressJobs} активных заявок
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 animate-slide-up">
          <div className="tg-stat">
            <div className="tg-stat-value text-warning">{stats.pendingJobs}</div>
            <div className="tg-stat-label text-xs">Ожидают</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-primary">{stats.inProgressJobs}</div>
            <div className="tg-stat-label text-xs">В работе</div>
          </div>
          <div className="tg-stat">
            <div className="tg-stat-value text-success">{stats.completedJobs}</div>
            <div className="tg-stat-label text-xs">Выполнено</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="tg-section-header">Быстрые действия</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAction('/technician/create')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">Новая заявка</span>
            </button>
            <button
              onClick={() => handleQuickAction('/technician/jobs')}
              className="tg-card-interactive flex flex-col items-center gap-3 py-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-medium">Все заявки</span>
            </button>
          </div>
        </div>

        {/* Pending jobs */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="tg-section-header">Активные заявки</p>
            <button
              onClick={() => handleQuickAction('/technician/jobs')}
              className="text-sm text-primary font-medium px-4"
            >
              Все
            </button>
          </div>
          <div className="bg-card rounded-xl overflow-hidden border border-border/50">
            {pendingJobs.map((job) => (
              <div
                key={job.id}
                className="tg-list-item cursor-pointer"
                onClick={() => hapticFeedback.light()}
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5" />
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
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

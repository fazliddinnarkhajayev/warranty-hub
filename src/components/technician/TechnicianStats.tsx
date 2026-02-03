import React from 'react';
import { Wrench, TrendingUp, CheckCircle, Clock, ShieldCheck, Banknote } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { getTechnicianStats } from '@/lib/mockData';

export const TechnicianStats: React.FC = () => {
  const stats = getTechnicianStats();

  const statCards = [
    {
      icon: Wrench,
      label: 'Всего заявок',
      value: stats.totalJobs,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: CheckCircle,
      label: 'Выполнено',
      value: stats.completedJobs,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Clock,
      label: 'В работе',
      value: stats.inProgressJobs + stats.pendingJobs,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: ShieldCheck,
      label: 'По гарантии',
      value: stats.warrantyJobs,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="tg-screen bg-background">
      <Header title="Статистика" showBack />

      <div className="p-4 space-y-6">
        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="tg-card animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
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
                  {stats.totalEarnings.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-sm text-muted-foreground">
                  За платные ремонты
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <p className="tg-section-header">Эффективность</p>
          <div className="tg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-semibold">Отличная работа!</p>
                <p className="text-sm text-muted-foreground">
                  {stats.completedJobs} из {stats.totalJobs} заявок выполнено
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Выполнено</span>
                <span className="font-medium">
                  {Math.round((stats.completedJobs / stats.totalJobs) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{
                    width: `${(stats.completedJobs / stats.totalJobs) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

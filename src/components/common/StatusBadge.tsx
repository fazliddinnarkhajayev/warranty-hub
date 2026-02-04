import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'expired' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  className?: string;
}

const statusConfig = {
  active: { label: 'Активна', className: 'tg-badge-success' },
  expired: { label: 'Истекла', className: 'tg-badge-error' },
  pending: { label: 'Ожидает', className: 'tg-badge-warning' },
  in_progress: { label: 'В работе', className: 'tg-badge-primary' },
  completed: { label: 'Выполнено', className: 'tg-badge-success' },
  cancelled: { label: 'Отменено', className: 'tg-badge-error' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
};

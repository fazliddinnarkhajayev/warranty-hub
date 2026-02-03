import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Plus, BarChart3, User, Wrench, ClipboardList } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const getNavItems = (role: string | null): NavItem[] => {
  switch (role) {
    case 'seller':
      return [
        { icon: Home, label: 'Главная', path: '/seller' },
        { icon: FileText, label: 'Гарантии', path: '/seller/warranties' },
        { icon: Plus, label: 'Создать', path: '/seller/create' },
        { icon: BarChart3, label: 'Статистика', path: '/seller/stats' },
        { icon: User, label: 'Профиль', path: '/profile' },
      ];
    case 'customer':
      return [
        { icon: Home, label: 'Главная', path: '/customer' },
        { icon: FileText, label: 'Гарантии', path: '/customer/warranties' },
        { icon: User, label: 'Профиль', path: '/profile' },
      ];
    case 'technician':
      return [
        { icon: Home, label: 'Главная', path: '/technician' },
        { icon: ClipboardList, label: 'Заявки', path: '/technician/jobs' },
        { icon: Wrench, label: 'Создать', path: '/technician/create' },
        { icon: BarChart3, label: 'Статистика', path: '/technician/stats' },
        { icon: User, label: 'Профиль', path: '/profile' },
      ];
    default:
      return [];
  }
};

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useApp();

  const navItems = getNavItems(role);

  if (navItems.length === 0) return null;

  const handleNavClick = (path: string) => {
    hapticFeedback.light();
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-background border-t border-nav-border">
      <div className="flex items-center justify-around h-16 pb-safe max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200',
                isActive ? 'text-nav-active' : 'text-nav-inactive'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'animate-scale-in')} />
              <span className="text-2xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

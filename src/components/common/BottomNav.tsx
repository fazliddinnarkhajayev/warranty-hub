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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors duration-200 rounded-lg min-w-0',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'animate-scale-in')} />
              <span className="text-[10px] font-medium truncate max-w-full px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Plus, BarChart3, User, Wrench, ShieldCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/telegram';
import { getTranslation } from '@/lib/i18n';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  labelKey: 'main' | 'warranties' | 'services' | 'create' | 'statistics' | 'profile';
}

const sellerNav: NavItem[] = [
  { path: '/seller', icon: <Home className="w-5 h-5" />, labelKey: 'main' },
  { path: '/seller/warranties', icon: <ShieldCheck className="w-5 h-5" />, labelKey: 'warranties' },
  { path: '/seller/create', icon: <Plus className="w-5 h-5" />, labelKey: 'create' },
  { path: '/seller/stats', icon: <BarChart3 className="w-5 h-5" />, labelKey: 'statistics' },
  { path: '/profile', icon: <User className="w-5 h-5" />, labelKey: 'profile' },
];

const customerNav: NavItem[] = [
  { path: '/customer', icon: <Home className="w-5 h-5" />, labelKey: 'main' },
  { path: '/customer/warranties', icon: <ShieldCheck className="w-5 h-5" />, labelKey: 'warranties' },
  { path: '/customer/services', icon: <Wrench className="w-5 h-5" />, labelKey: 'services' },
  { path: '/customer/stats', icon: <BarChart3 className="w-5 h-5" />, labelKey: 'statistics' },
  { path: '/profile', icon: <User className="w-5 h-5" />, labelKey: 'profile' },
];

const technicianNav: NavItem[] = [
  { path: '/technician', icon: <Home className="w-5 h-5" />, labelKey: 'main' },
  { path: '/technician/jobs', icon: <Wrench className="w-5 h-5" />, labelKey: 'services' },
  { path: '/technician/create', icon: <Plus className="w-5 h-5" />, labelKey: 'create' },
  { path: '/technician/stats', icon: <BarChart3 className="w-5 h-5" />, labelKey: 'statistics' },
  { path: '/profile', icon: <User className="w-5 h-5" />, labelKey: 'profile' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user, language } = useApp();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'seller':
        return sellerNav;
      case 'customer':
        return customerNav;
      case 'technician':
        return technicianNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  if (navItems.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--nav-background))] border-t border-[hsl(var(--nav-border))] safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/profile' && location.pathname.startsWith(item.path) && item.path.length > 1);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => hapticFeedback.selection()}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                isActive ? 'text-[hsl(var(--nav-active))]' : 'text-[hsl(var(--nav-inactive))]'
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';
import { Store, User, Wrench, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, UserRole } from '@/contexts/AppContext';
import { hapticFeedback } from '@/lib/telegram';
import { cn } from '@/lib/utils';

interface RoleOption {
  role: UserRole;
  icon: React.ElementType;
  title: string;
  description: string;
}

const roles: RoleOption[] = [
  {
    role: 'seller',
    icon: Store,
    title: 'Продавец',
    description: 'Создание гарантий и управление продажами',
  },
  {
    role: 'customer',
    icon: User,
    title: 'Покупатель',
    description: 'Просмотр гарантий и история обслуживания',
  },
  {
    role: 'technician',
    icon: Wrench,
    title: 'Мастер',
    description: 'Сервисное обслуживание и ремонт',
  },
];

export const RoleSelect: React.FC = () => {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    hapticFeedback.medium();
    setRole(role);
    navigate('/verify');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero section */}
      <div className="flex-shrink-0 px-6 pt-12 pb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce-in">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2 animate-fade-in">Warranty Bot</h1>
        <p className="text-muted-foreground animate-fade-in">
          Система управления гарантией и сервисом
        </p>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-4 pb-8">
        <p className="text-sm text-muted-foreground text-center mb-6 animate-fade-in">
          Выберите вашу роль
        </p>
        
        <div className="space-y-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <button
                key={role.role}
                onClick={() => handleRoleSelect(role.role)}
                className={cn(
                  'w-full tg-card-interactive flex items-center gap-4 text-left',
                  'animate-slide-up'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{role.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

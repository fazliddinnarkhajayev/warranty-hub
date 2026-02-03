import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser, initTelegramWebApp } from '@/lib/telegram';

export type UserRole = 'seller' | 'customer' | 'technician' | null;

interface AppUser {
  telegramId: number;
  name: string;
  phone: string;
  role: UserRole;
}

interface AppContextType {
  user: AppUser | null;
  isRegistered: boolean;
  isLoading: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setPhone: (phone: string) => void;
  completeRegistration: (role: UserRole, phone: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramWebApp();

    // Check for existing registration
    const savedUser = localStorage.getItem('warranty_bot_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }

    setIsLoading(false);
  }, []);

  const completeRegistration = (role: UserRole, phone: string) => {
    const telegramUser = getUser();
    const newUser: AppUser = {
      telegramId: telegramUser.id,
      name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
      phone,
      role,
    };
    setUser(newUser);
    localStorage.setItem('warranty_bot_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    localStorage.removeItem('warranty_bot_user');
  };

  const setRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const setPhone = (phone: string) => {
    if (selectedRole) {
      completeRegistration(selectedRole, phone);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isRegistered: !!user,
        isLoading,
        role: user?.role || selectedRole,
        setRole,
        setPhone,
        completeRegistration,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

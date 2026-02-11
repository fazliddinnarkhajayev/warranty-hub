import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getTelegramUser, initTelegramWebApp, getTelegramWebApp } from "@/lib/telegram";
import { authApi } from "@/lib/api";
import type { User, AuthStatus, UserRole } from "@/lib/api/types";
import { detectLanguage, type Language } from "@/lib/i18n";

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  authStatus: AuthStatus | null;
  language: Language;
  theme: 'light' | 'dark';
  telegramUser: { id: number; first_name: string; last_name?: string; phone?: string } | null;
  setUser: (user: User | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  logout: () => void;
  checkAuth: (phone: string) => Promise<AuthStatus>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [language, setLanguage] = useState<Language>('ru');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [telegramUser, setTelegramUser] = useState<{ id: number; first_name: string; last_name?: string; phone?: string } | null>(null);

  useEffect(() => {
    initTelegramWebApp();

    const detectedLang = detectLanguage();
    setLanguage(detectedLang);

    const tgUser = getTelegramUser();
    if (tgUser) {
      setTelegramUser({
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
      });
    }

    const webApp = getTelegramWebApp();
    if (webApp?.colorScheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    const savedUser = localStorage.getItem("warranty_bot_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setUser(parsed);
        setAuthStatus(parsed.status);
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const checkAuth = async (phone: string): Promise<AuthStatus> => {
    try {
      const response = await authApi.telegramAuth({ phone });

      setAuthStatus(response.status);

      if (response.status === 'CREATED' && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem("warranty_bot_user", JSON.stringify(response.user));
        localStorage.setItem("warranty_bot_token", response.token);
      }

      return response.status;
    } catch (error) {
      console.error('Auth check failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthStatus(null);
    localStorage.removeItem("warranty_bot_user");
    localStorage.removeItem("warranty_bot_token");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        authStatus,
        language,
        theme,
        telegramUser,
        setUser,
        setAuthStatus,
        setLanguage,
        setTheme,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export type { UserRole } from "@/lib/api/types";

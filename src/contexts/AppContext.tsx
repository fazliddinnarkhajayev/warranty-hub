import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getTelegramUser, initTelegramWebApp, getTelegramWebApp } from "@/lib/telegram";
import { authApi } from "@/lib/api";
import type { User, UserType } from "@/lib/api/types";
import { detectLanguage, type Language } from "@/lib/i18n";

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  language: Language;
  theme: 'light' | 'dark';
  telegramUser: { id: number; first_name: string; last_name?: string; phone?: string } | null;
  setUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  logout: () => void;
  login: (phone: string) => Promise<{ success: boolean; error?: string }>;
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
  const [language, setLanguage] = useState<Language>('ru');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [telegramUser, setTelegramUser] = useState<{ id: number; first_name: string; last_name?: string; phone?: string } | null>(null);

  const isAuthenticated = !!user;

  // On app start: restore session
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

    // Try to restore session from token
    const token = localStorage.getItem("warranty_bot_token");
    if (token) {
      authApi.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem("warranty_bot_user", JSON.stringify(userData));
        })
        .catch(() => {
          // Token invalid/expired — clear everything
          localStorage.removeItem("warranty_bot_token");
          localStorage.removeItem("warranty_bot_user");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // No token — try cached user as fallback
      const savedUser = localStorage.getItem("warranty_bot_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const login = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login({ phone });

      if (response.success && response.access_token && response.user) {
        localStorage.setItem("warranty_bot_token", response.access_token);
        localStorage.setItem("warranty_bot_user", JSON.stringify(response.user));
        setUser(response.user);
        return { success: true };
      }

      return { success: false, error: 'User not found' };
    } catch (error: any) {
      console.warn('[Auth] Login failed:', error);
      // Fallback for development
      try {
        const { fallbackUser } = await import('@/lib/fallbackData');
        const testUser: User = { ...fallbackUser, phone };
        setUser(testUser);
        localStorage.setItem("warranty_bot_user", JSON.stringify(testUser));
        localStorage.setItem("warranty_bot_token", "test-fallback-token");
        return { success: true };
      } catch {
        return { success: false, error: error?.response?.data?.message || 'Network error' };
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("warranty_bot_user");
    localStorage.removeItem("warranty_bot_token");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        language,
        theme,
        telegramUser,
        setUser,
        setLanguage,
        setTheme,
        logout,
        login,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export type { UserType } from "@/lib/api/types";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser, initTelegramWebApp } from "@/lib/telegram";

export type UserRole = "seller" | "customer" | "technician" | null;

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
    throw new Error("useApp must be used within an AppProvider");
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
    // 1️⃣ Telegram WebApp init
    initTelegramWebApp();

    // 2️⃣ Load user from localStorage if exists
    const savedUser = localStorage.getItem("warranty_bot_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as AppUser;
        setUser(parsed);
        setSelectedRole(parsed.role); // role guard uchun
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }

    setIsLoading(false);
  }, []);

  // Complete registration (role + phone)
  const completeRegistration = (role: UserRole, phone: string) => {
    const telegramUser = getUser();
    const newUser: AppUser = {
      telegramId: telegramUser.id,
      name: `${telegramUser.first_name} ${telegramUser.last_name || ""}`.trim(),
      phone,
      role,
    };
    setUser(newUser);
    setSelectedRole(role);
    localStorage.setItem("warranty_bot_user", JSON.stringify(newUser));
  };

  // Logout
  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    localStorage.removeItem("warranty_bot_user");
  };

  // Set role before phone verification
  const setRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  // Set phone (calls completeRegistration if role is selected)
  const setPhone = (phone: string) => {
    if (selectedRole) {
      completeRegistration(selectedRole, phone);
    } else {
      console.warn("Role not selected yet");
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

// Telegram WebApp integration

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  close: () => void;
  expand: () => void;
  ready: () => void;
  sendData: (data: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

// Get Telegram WebApp instance
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Get current Telegram user
export const getTelegramUser = (): TelegramUser | null => {
  const webApp = getTelegramWebApp();
  return webApp?.initDataUnsafe?.user || null;
};

// Initialize Telegram WebApp
export const initTelegramWebApp = () => {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.ready();
    webApp.expand();
    
    // Apply theme
    if (webApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

// Haptic feedback helpers
export const hapticFeedback = {
  light: () => getTelegramWebApp()?.HapticFeedback.impactOccurred('light'),
  medium: () => getTelegramWebApp()?.HapticFeedback.impactOccurred('medium'),
  heavy: () => getTelegramWebApp()?.HapticFeedback.impactOccurred('heavy'),
  success: () => getTelegramWebApp()?.HapticFeedback.notificationOccurred('success'),
  error: () => getTelegramWebApp()?.HapticFeedback.notificationOccurred('error'),
  warning: () => getTelegramWebApp()?.HapticFeedback.notificationOccurred('warning'),
  selection: () => getTelegramWebApp()?.HapticFeedback.selectionChanged(),
};

// Mock user for development (when not in Telegram)
export const getMockUser = (): TelegramUser => ({
  id: 123456789,
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser',
  language_code: 'en',
});

// Get user (real or mock)
export const getUser = (): TelegramUser => {
  return getTelegramUser() || getMockUser();
};

export const tg =
  (window as any).Telegram?.WebApp || {
    initDataUnsafe: {
      user: {
        id: 999,
        first_name: "Local",
        username: "tester",
      },
    },
    ready: () => {},
    expand: () => {},
    themeParams: {
      bg_color: "#0f172a",
      text_color: "#ffffff",
    },
  };

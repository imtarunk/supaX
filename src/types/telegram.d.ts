declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        ready: () => void;
        expand: () => void;
        close: () => void;
        openLink: (
          url: string,
          options?: { try_instant_view: boolean }
        ) => void;
      };
    };
  }
}

export {};

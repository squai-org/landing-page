/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Tally?: {
    openPopup: (formId: string, options?: Record<string, unknown>) => void;
    closePopup: (formId: string) => void;
  };
}

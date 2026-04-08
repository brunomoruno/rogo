/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_API_KEY?: string
  readonly VITE_LINKEDIN_POST_URL?: string
  readonly VITE_X_POST_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

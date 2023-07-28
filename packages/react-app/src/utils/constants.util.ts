const constants: Record<string, ImportMetaEnv> = {
  FRONTEND_URI: import.meta.env.VITE_FRONTEND_URI,
  API_URI: import.meta.env.VITE_API_URI,
};

export const get = (name: string): ImportMetaEnv => constants[name];

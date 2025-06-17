export function getEnv(key: 'VITE_PUBLIC_SERVER' | 'VITE_PUBLIC_Y_SERVER') {
  const env = (import.meta as unknown as {env: Record<string, string>}).env;
  return env[key];
}

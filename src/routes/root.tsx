import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { HealthBadge } from '@/features/health/HealthBadge';
import { useThemeStore } from '@/stores/theme';

export function RootLayout() {
  const theme = useThemeStore((s) => s.theme);

  // Apply the theme to <html> whenever it changes (index.html sets it pre-paint).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center">
          <HealthBadge />
        </div>
      </footer>
    </div>
  );
}

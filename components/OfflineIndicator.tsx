import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="وضعیت اتصال شبکه" className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 px-3.5 py-2 text-xs font-medium text-white shadow-xl backdrop-blur-md border border-amber-400/30">
      <span className="h-2 w-2 rounded-full bg-amber-200 animate-pulse" />
      <span>حالت آفلاین — برنامه بدون نیاز به اینترنت کار می‌کند.</span>
    </aside>
  );
};

export default OfflineIndicator;

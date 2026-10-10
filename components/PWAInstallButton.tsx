import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="نصب اپلیکیشن روی دستگاه"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>نصب برنامه</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800/80 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors"
          title="راهنمای نصب روی آیفون / آیپد"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-3-3m3 3l3-3m-6 7h6" />
          </svg>
          <span>نصب در iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-gray-800 border border-gray-700 p-6 shadow-2xl text-right">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">📲</span>
                <h3 className="text-base font-bold text-white">نصب روی iPhone و iPad</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed space-y-2">
                <span>برای نصب اپلیکیشن در مرورگر Safari:</span>
                <br />
                <span className="inline-block mt-2 font-medium text-blue-400">۱. دکمه Share (اشتراک‌گذاری ⎋) را در پایین صفحه لمس کنید.</span>
                <br />
                <span className="inline-block mt-1 font-medium text-emerald-400">۲. به پایین اسکرول کرده و گزینه «Add to Home Screen» (افزودن به صفحه اصلی) را انتخاب کنید.</span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-gray-700 py-2 text-sm font-medium text-white hover:bg-gray-600 transition"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
export default PWAInstallButton;

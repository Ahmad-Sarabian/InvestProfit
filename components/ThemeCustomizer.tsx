import React, { useState, useRef, useEffect } from 'react';
import type { Theme, FontSize } from '../types';

interface ThemeCustomizerProps {
    theme: Theme;
    fontSize: FontSize;
    onThemeChange: (theme: Theme) => void;
    onFontSizeChange: (size: FontSize) => void;
}

const themes: { id: Theme; name: string; }[] = [
    { id: 'dark-blue', name: 'آبی تیره' },
    { id: 'light', name: 'روشن' },
    { id: 'forest', name: 'جنگل' },
];

const fontSizes: { id: FontSize; name: string }[] = [
    { id: 'sm', name: 'کوچک' },
    { id: 'md', name: 'متوسط' },
    { id: 'lg', name: 'بزرگ' },
];

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ theme, fontSize, onThemeChange, onFontSizeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                aria-label="Customize theme"
            >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.481.398.688 1.043.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 p-4">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">پوسته برنامه</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => onThemeChange(t.id)}
                                        className={`text-xs py-2 rounded-md transition-all ${theme === t.id ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white font-bold' : 'hover:bg-gray-700/50'}`}
                                        title={t.name}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">اندازه فونت</h4>
                            <div className="flex items-center gap-1 bg-gray-700 rounded-md p-1">
                                {fontSizes.map((fs) => (
                                    <button
                                        key={fs.id}
                                        onClick={() => onFontSizeChange(fs.id)}
                                        className={`w-full text-xs py-1 rounded-md transition-colors ${fontSize === fs.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        {fs.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeCustomizer;
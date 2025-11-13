import React from 'react';
import { SunIcon, MoonIcon } from './icons';
import { Logo } from './Logo';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white/70 dark:bg-charcoal/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Logo 
              theme={theme}
              alt="Vaani Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-500">
              Vaani
              <span className="text-gray-600 dark:text-gray-300 font-light hidden sm:inline"> – AI Audio Transcriber</span>
            </h1>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

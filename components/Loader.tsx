
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="m-auto flex flex-col items-center justify-center space-y-4">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 animate-pulse-glow shadow-emerald-glow dark:shadow-white-glow"></div>
        <div className="absolute inset-2 rounded-full bg-emerald-500/30 dark:bg-emerald-400/30 animate-pulse-glow animation-delay-[-1.5s]"></div>
        <div className="absolute inset-4 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <svg className="w-16 h-16 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
                <circle cx="12" cy="5" r="1" fill="currentColor"/>
                <circle cx="19" cy="12" r="1" fill="currentColor"/>
                <circle cx="5" cy="12" r="1" fill="currentColor"/>
            </svg>
        </div>
      </div>
      <p className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">Vaani is thinking...</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Processing your audio, please wait.</p>
    </div>
  );
};

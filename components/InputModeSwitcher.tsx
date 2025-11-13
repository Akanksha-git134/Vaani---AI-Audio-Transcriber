
import React from 'react';
import type { InputMode } from '../types';
import { UploadIcon, MicIcon } from './icons';

interface InputModeSwitcherProps {
  mode: InputMode;
  setMode: (mode: InputMode) => void;
}

export const InputModeSwitcher: React.FC<InputModeSwitcherProps> = ({ mode, setMode }) => {
  const baseClasses = "flex-1 py-2.5 px-4 text-sm font-medium focus:outline-none transition-all duration-300 flex items-center justify-center space-x-2";
  const activeClasses = "bg-emerald-500 text-white shadow-md";
  const inactiveClasses = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className="flex w-full rounded-full overflow-hidden mb-6 border border-gray-300 dark:border-gray-600">
      <button
        onClick={() => setMode('file')}
        className={`${baseClasses} rounded-l-full ${mode === 'file' ? activeClasses : inactiveClasses}`}
      >
        <UploadIcon className="h-5 w-5" />
        <span>File Upload</span>
      </button>
      <button
        onClick={() => setMode('mic')}
        className={`${baseClasses} rounded-r-full ${mode === 'mic' ? activeClasses : inactiveClasses}`}
      >
        <MicIcon className="h-5 w-5" />
        <span>Microphone</span>
      </button>
    </div>
  );
};

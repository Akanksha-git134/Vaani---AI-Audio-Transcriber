
import React, { useState, useEffect } from 'react';
import type { TranscriptionResult } from '../types';
import { CopyIcon, CheckIcon, DownloadIcon, RefreshIcon } from './icons';

interface ResultDisplayProps {
  result: TranscriptionResult;
  onReset: () => void;
}

const ActionButton: React.FC<{ onClick: () => void, text: string, icon: React.ReactNode }> = ({ onClick, text, icon }) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
        {icon}
        <span>{text}</span>
    </button>
);

const Confetti: React.FC = () => {
    const confettiPieces = Array.from({ length: 30 }).map((_, i) => {
        const randomX = (Math.random() - 0.5) * 400; // -200 to 200
        const randomY = (Math.random() - 0.5) * 500; // -250 to 250
        const randomRot = Math.random() * 720 - 360; // -360 to 360
        const randomDelay = Math.random() * 0.2;
        const colors = ['#10b981', '#a7f3d0', '#f59e0b', '#3b82f6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const style = {
            '--tx': `${randomX}px`,
            '--ty': `${randomY}px`,
            '--r': `${randomRot}deg`,
            animationDelay: `${randomDelay}s`,
            backgroundColor: randomColor,
        } as React.CSSProperties;

        return <div key={i} className="absolute top-1/2 left-1/2 w-2 h-3 rounded-sm animate-confetti-burst" style={style} />;
    });

    return <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">{confettiPieces}</div>;
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState<'transcription' | 'translation' | 'summary' | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, [result]);


  const handleCopy = (text: string, type: 'transcription' | 'translation' | 'summary') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFullTranscription = () => result.transcription;
  const getFullSummary = () => `Summary:\n\n${result.summary?.map(s => `- ${s}`).join('\n') || ''}`;

  return (
    <div className="space-y-6 w-full relative">
      {showConfetti && <Confetti />}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">Detected Language: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{result.detectedLanguage}</span></p>
         <button
          onClick={onReset}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
        >
            <RefreshIcon className="h-4 w-4" />
            <span>Start New</span>
        </button>
      </div>
      
      {/* Transcription */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Transcription</h3>
          <div className="flex space-x-2">
            <ActionButton 
                onClick={() => handleCopy(getFullTranscription(), 'transcription')}
                text={copied === 'transcription' ? 'Copied!' : 'Copy'}
                icon={copied === 'transcription' ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />}
            />
            <ActionButton 
                onClick={() => handleDownload(getFullTranscription(), 'transcription.txt')}
                text="Download"
                icon={<DownloadIcon className="h-4 w-4" />}
            />
          </div>
        </div>
        <p className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md text-sm leading-relaxed max-h-48 overflow-y-auto">{result.transcription}</p>
      </div>

      {/* Translation */}
      {result.translation && (
         <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Translation</h3>
                 <ActionButton 
                    onClick={() => handleCopy(result.translation!, 'translation')}
                    text={copied === 'translation' ? 'Copied!' : 'Copy'}
                    icon={copied === 'translation' ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />}
                />
            </div>
            <p className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md text-sm leading-relaxed max-h-48 overflow-y-auto">{result.translation}</p>
        </div>
      )}

      {/* Summary */}
      {result.summary && result.summary.length > 0 && (
         <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Summary</h3>
                <div className="flex space-x-2">
                    <ActionButton 
                        onClick={() => handleCopy(getFullSummary(), 'summary')}
                        text={copied === 'summary' ? 'Copied!' : 'Copy'}
                        icon={copied === 'summary' ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />}
                    />
                     <ActionButton 
                        onClick={() => handleDownload(getFullSummary(), 'summary.txt')}
                        text="Download"
                        icon={<DownloadIcon className="h-4 w-4" />}
                    />
                </div>
            </div>
            <ul className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md text-sm space-y-2 list-disc list-inside">
              {result.summary.map((point, index) => (
                <li key={index} className="leading-relaxed">{point}</li>
              ))}
            </ul>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { LANGUAGES } from '../constants';
import { TranslateIcon, SummarizeIcon, SparklesIcon, RefreshIcon } from './icons';

interface OptionsPanelProps {
  sourceLang: string;
  setSourceLang: (lang: string) => void;
  targetLang: string;
  setTargetLang: (lang: string) => void;
  doTranslate: boolean;
  setDoTranslate: (value: boolean) => void;
  doSummarize: boolean;
  setDoSummarize: (value: boolean) => void;
  summaryPoints: number;
  setSummaryPoints: (points: number) => void;
  onTranscribe: () => void;
  onResetOptions: () => void;
  isProcessing: boolean;
  isFileUploaded: boolean;
}

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ checked, onChange, icon, label }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="flex items-center space-x-3">
      <span className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">{icon}</span>
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);

export const OptionsPanel: React.FC<OptionsPanelProps> = (props) => {
  const { onTranscribe, onResetOptions, isProcessing, isFileUploaded, sourceLang, setSourceLang, targetLang, setTargetLang, doTranslate, setDoTranslate, doSummarize, setDoSummarize, summaryPoints, setSummaryPoints } = props;
  
  const handleSummaryPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Enforce a minimum of 3 points, but no upper limit.
    const value = Math.max(3, Number(e.target.value));
    setSummaryPoints(value);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Options</h2>
        <button
          onClick={onResetOptions}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          aria-label="Reset options"
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="source-lang" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source Language</label>
        <select id="source-lang" value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500">
          {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
        </select>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ToggleSwitch
          checked={doTranslate}
          onChange={setDoTranslate}
          icon={<TranslateIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          label="Translate"
        />
        {doTranslate && (
          <div className="pl-8">
            <label htmlFor="target-lang" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Language</label>
            <select id="target-lang" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500">
              {LANGUAGES.filter(l => l.code !== 'auto').map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ToggleSwitch
          checked={doSummarize}
          onChange={setDoSummarize}
          icon={<SummarizeIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          label="Summarize"
        />
        {doSummarize && (
          <div className="pl-8 flex items-center justify-between">
            <label htmlFor="summary-points" className="text-sm font-medium text-gray-700 dark:text-gray-300">Bullet Points</label>
            <input
              type="number"
              id="summary-points"
              value={summaryPoints}
              onChange={handleSummaryPointsChange}
              min="3"
              className="w-20 p-2 text-center border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      <button
        onClick={onTranscribe}
        disabled={!isFileUploaded || isProcessing}
        className="w-full flex items-center justify-center py-3 px-4 text-lg font-semibold text-white bg-emerald-600 rounded-lg shadow-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <SparklesIcon className="h-6 w-6 mr-2" />
        {isProcessing ? 'Processing...' : 'Transcribe'}
      </button>
    </div>
  );
};
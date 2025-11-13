
import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon, TrashIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onClear: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onClear, onDeleteItem }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <HistoryIcon className="h-6 w-6" />
          <span>History</span>
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No past transcriptions.</p>
        ) : (
          history.map(item => (
            <div key={item.id} className="relative group w-full">
              <button
                onClick={() => onLoad(item)}
                className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium text-sm truncate pr-8">{item.fileName}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{`Lang: ${item.detectedLanguage}`}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic truncate">{item.transcriptionPreview}...</p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label="Delete item"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Header } from './components/Header';
import { InputModeSwitcher } from './components/InputModeSwitcher';
import { FileUpload, type FileUploadHandle } from './components/FileUpload';
import { MicrophoneRecorder } from './components/MicrophoneRecorder';
import { OptionsPanel } from './components/OptionsPanel';
import { InstructionsPanel } from './components/InstructionsPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { Loader } from './components/Loader';
import { transcribeAudio } from './services/geminiService';
import type { TranscriptionResult, HistoryItem, InputMode } from './types';
import { fileToBase64, getMediaDuration } from './utils/fileUtils';

// IMPORTANT: Replace with your actual Gemini API Key.
// The key's availability is handled externally and is a hard requirement.
const GEMINI_API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'dark' : 'light';
  });

  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ name: string; duration: string; url?: string; type?: string; } | null>(null);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [doTranslate, setDoTranslate] = useState(false);
  const [doSummarize, setDoSummarize] = useState(false);
  const [summaryPoints, setSummaryPoints] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const fileUploadRef = useRef<FileUploadHandle>(null);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('transcriptionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleFileChange = async (selectedFile: File | null) => {
    // Revoke previous URL if it exists to prevent memory leaks
    if (fileData?.url) {
      URL.revokeObjectURL(fileData.url);
    }
      
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      try {
        const url = URL.createObjectURL(selectedFile);
        const duration = await getMediaDuration(selectedFile);
        setFileData({
            name: selectedFile.name,
            duration,
            url,
            type: selectedFile.type,
        });
      } catch (err) {
        setError('Could not read file metadata.');
        setFileData(null);
      }
    } else {
      setFile(null);
      setFileData(null);
    }
  };
  
  const handleRecordingComplete = async (recordingFile: File | null) => {
    // Process the file to set it in the parent state. This allows the "Transcribe" button
    // to become active while the user remains on the microphone screen.
    await handleFileChange(recordingFile);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setFile(null);
    if (fileData?.url) {
      URL.revokeObjectURL(fileData.url);
    }
    setFileData(null);
    fileUploadRef.current?.reset();
  };
  
  const handleResetOptions = () => {
    setSourceLang('auto');
    setTargetLang('en');
    setDoTranslate(false);
    setDoSummarize(false);
    setSummaryPoints(5);
  };

  const handleTranscribe = useCallback(async () => {
    if (!file) {
      setError('Please upload or record a file first.');
      return;
    }
    if (!GEMINI_API_KEY) {
        setError('Gemini API key is not configured.');
        return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const base64data = await fileToBase64(file);
      const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

      const transcriptionResult = await transcribeAudio(ai, base64data, file.type, {
        sourceLang,
        targetLang,
        doTranslate,
        doSummarize,
        summaryPoints,
      });

      setResult(transcriptionResult);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        fileName: file.name,
        detectedLanguage: transcriptionResult.detectedLanguage,
        transcriptionPreview: transcriptionResult.transcription.substring(0, 100),
        result: transcriptionResult,
      };
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('transcriptionHistory', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during transcription.');
    } finally {
      setIsLoading(false);
    }
  }, [file, sourceLang, targetLang, doTranslate, doSummarize, summaryPoints, history]);

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.result);
    setFile(null);
    setFileData({ name: item.fileName, duration: 'N/A' });
    setError(null);
    setInputMode('file');
    fileUploadRef.current?.reset();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('transcriptionHistory');
  };
  
  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('transcriptionHistory', JSON.stringify(updatedHistory));
  };


  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white dark:bg-charcoal dark:text-gray-200 transition-colors duration-500">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input and Options */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
              <InputModeSwitcher mode={inputMode} setMode={setInputMode} />
              {inputMode === 'file' ? (
                <FileUpload ref={fileUploadRef} onFileChange={handleFileChange} fileData={fileData} />
              ) : (
                <MicrophoneRecorder onRecordingComplete={handleRecordingComplete} />
              )}
            </div>
            
            <InstructionsPanel />

            <OptionsPanel
              sourceLang={sourceLang}
              setSourceLang={setSourceLang}
              targetLang={targetLang}
              setTargetLang={setTargetLang}
              doTranslate={doTranslate}
              setDoTranslate={setDoTranslate}
              doSummarize={doSummarize}
              setDoSummarize={setDoSummarize}
              summaryPoints={summaryPoints}
              setSummaryPoints={setSummaryPoints}
              onTranscribe={handleTranscribe}
              onResetOptions={handleResetOptions}
              isProcessing={isLoading}
              isFileUploaded={!!file}
            />
          </div>

          {/* Right Column: Results and History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="min-h-[400px] bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col">
              {isLoading && <Loader />}
              {!isLoading && error && <div className="text-red-500 text-center m-auto p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">{error}</div>}
              {!isLoading && !error && result && <ResultDisplay result={result} onReset={handleReset} />}
              {!isLoading && !error && !result && (
                <div className="m-auto text-center text-gray-400 dark:text-gray-500">
                  <p className="text-lg">Your transcription will appear here.</p>
                  <p className="text-sm">Upload a file or record audio and click "Transcribe" to begin.</p>
                </div>
              )}
            </div>
            <HistoryPanel history={history} onLoad={loadFromHistory} onClear={clearHistory} onDeleteItem={deleteHistoryItem} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

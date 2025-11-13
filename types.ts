
export interface TranscriptionResult {
  detectedLanguage: string;
  transcription: string;
  translation?: string;
  summary?: string[];
}

export interface HistoryItem {
  id: string;
  fileName: string;
  detectedLanguage: string;
  transcriptionPreview: string;
  result: TranscriptionResult;
}

export interface TranscriptionOptions {
  sourceLang: string;
  targetLang: string;
  doTranslate: boolean;
  doSummarize: boolean;
  summaryPoints: number;
}

export type InputMode = 'file' | 'mic';

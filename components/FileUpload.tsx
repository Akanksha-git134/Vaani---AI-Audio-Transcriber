
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { UploadIcon, FileAudioIcon, ClockIcon, TrashIcon } from './icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  fileData: { name: string; duration: string; url?: string; type?: string; } | null;
}

export interface FileUploadHandle {
  reset: () => void;
}

export const FileUpload = forwardRef<FileUploadHandle, FileUploadProps>(({ onFileChange, fileData }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }));

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };
  
  const handleRemoveFile = () => {
      onFileChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="audio/mpeg,audio/wav,video/mp4,audio/x-m4a"
      />

      {!fileData ? (
        <label
          htmlFor="file-upload"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV, MP4, M4A</p>
          </div>
        </label>
      ) : (
        <div className="p-4 border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <FileAudioIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{fileData.name}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>{fileData.duration}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Remove file"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Media Preview */}
          {fileData.url && fileData.type && (
            <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
              {fileData.type.startsWith('audio/') ? (
                <audio controls src={fileData.url} className="w-full h-10"></audio>
              ) : fileData.type.startsWith('video/') ? (
                <video controls src={fileData.url} className="w-full rounded-md max-h-40"></video>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

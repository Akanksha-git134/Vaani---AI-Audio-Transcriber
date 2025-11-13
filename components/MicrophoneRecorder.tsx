import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, StopCircleIcon, TrashIcon, PlayIcon, PauseIcon } from './icons';

interface MicrophoneRecorderProps {
  onRecordingComplete: (file: File | null) => void;
}

type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped' | 'ready';

export const MicrophoneRecorder: React.FC<MicrophoneRecorderProps> = ({ onRecordingComplete }) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Refs for audio visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const cleanup = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);
  
  const internalReset = () => {
    cleanup();
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setStatus('idle');
    setDuration(0);
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current || !audioContextRef.current || audioContextRef.current.state === 'closed') return;

    animationFrameIdRef.current = requestAnimationFrame(draw);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };


  const startRecording = async () => {
    try {
      handleReset();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setStatus('recording');
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();

      setDuration(0);
      timerIntervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // FIX: Cast window to `any` to allow for vendor-prefixed `webkitAudioContext` for older browser compatibility.
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      
      draw();

    } catch (err) {
      console.error("Failed to start recording:", err);
      setStatus('idle');
      alert("Could not access the microphone. Please check permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
      timerIntervalRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      draw();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      cleanup();
      setStatus('stopped');
    }
  };
  
  const handleUseRecording = () => {
    if (audioURL) {
      fetch(audioURL)
        .then(res => res.blob())
        .then(blob => {
          const audioFile = new File([blob], `recording-${new Date().toISOString()}.webm`, { type: 'audio/webm' });
          onRecordingComplete(audioFile);
          setStatus('ready');
        });
    }
  };

  const handleReset = () => {
    internalReset();
    onRecordingComplete(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <canvas ref={canvasRef} width="300" height="80" className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></canvas>

      <div className="text-2xl font-mono text-gray-700 dark:text-gray-300">
        {formatTime(duration)}
      </div>

      <div className="h-16 flex items-center justify-center">
        {status === 'idle' && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            aria-label="Start recording"
          >
            <MicIcon className="h-8 w-8" />
          </button>
        )}

        {(status === 'recording' || status === 'paused') && (
            <div className="flex items-center space-x-6">
                {status === 'recording' ? (
                    <button
                        onClick={pauseRecording}
                        className="flex items-center justify-center w-14 h-14 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        aria-label="Pause recording"
                    >
                        <PauseIcon className="h-7 w-7" />
                    </button>
                ) : ( // status === 'paused'
                    <button
                        onClick={resumeRecording}
                        className="flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        aria-label="Resume recording"
                    >
                        <PlayIcon className="h-7 w-7" />
                    </button>
                )}
                <button
                    onClick={stopRecording}
                    className={`flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${status === 'recording' ? 'animate-pulse' : ''}`}
                    aria-label="Stop recording"
                >
                    <StopCircleIcon className="h-8 w-8" />
                </button>
            </div>
        )}
      </div>

      {(status === 'stopped' || status === 'ready') && (
        <div className="w-full space-y-4">
          {audioURL && <audio src={audioURL} controls className="w-full h-10" />}
          
          {status === 'ready' && (
            <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md text-sm font-medium">
              <p>Recording is ready to be transcribed.</p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
              aria-label={status === 'ready' ? 'Record a new audio' : 'Discard recording'}
            >
              <TrashIcon className="h-5 w-5" />
              <span>{status === 'ready' ? 'Record New' : 'Discard'}</span>
            </button>
            
            {status === 'stopped' && (
                <button
                onClick={handleUseRecording}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                aria-label="Use this recording"
                >
                <PlayIcon className="h-5 w-5" />
                <span>Use Recording</span>
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

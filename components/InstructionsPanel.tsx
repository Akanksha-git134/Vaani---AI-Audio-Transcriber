
import React from 'react';

export const InstructionsPanel: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Instructions</h2>

      <div>
        <h3 className="font-semibold text-base mb-2">🟢 1. Choose Your Audio Source</h3>
        <p>You can either upload a file or record using your microphone (switch between the two tabs at the top left).</p>
        <div className="pl-4 mt-2 space-y-2">
          <div>
            <p className="font-medium">File Upload:</p>
            <ul className="list-disc list-inside pl-2 text-gray-600 dark:text-gray-400">
              <li>Click the “File Upload” tab.</li>
              <li>Drag & drop or select an audio/video file (.mp3, .wav, .mp4, .m4a).</li>
              <li>Once uploaded, you’ll see the file name, duration, and a preview player.</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Microphone Recording:</p>
            <ul className="list-disc list-inside pl-2 text-gray-600 dark:text-gray-400">
                <li>Click the “Microphone” tab.</li>
                <li>Press the green microphone button to start recording (allow mic access).</li>
                <li>You can pause, resume, or stop anytime.</li>
                <li>After stopping, preview your clip and click “Use Recording” to prepare it for transcription.</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2">⚙️ 2. Set Your Options</h3>
        <p>Customize how your audio is processed in the Options panel:</p>
        <ul className="list-disc list-inside pl-6 text-gray-600 dark:text-gray-400">
            <li><span className="font-medium">Source Language:</span> Leave on Auto-detect or select manually.</li>
            <li><span className="font-medium">Translate:</span> Turn on to translate the transcript → choose your target language.</li>
            <li><span className="font-medium">Summarize:</span> Turn on to generate a summary → set the number of bullet points (minimum 3).</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2">📝 3. Start the Transcription</h3>
        <ul className="list-disc list-inside pl-6 text-gray-600 dark:text-gray-400">
            <li>When your audio is ready, click the green “Transcribe” button.</li>
            <li>The AI will process your file — a loading animation will appear.</li>
            <li>Sit back and let Vaani do the magic!</li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold text-base mb-2">📄 4. View Your Results</h3>
        <p>After processing, results appear on the right panel:</p>
        <ul className="list-disc list-inside pl-6 text-gray-600 dark:text-gray-400">
            <li><span className="font-medium">Transcription</span> → Full text of your audio.</li>
            <li><span className="font-medium">Translation</span> → (if enabled) AI-translated text.</li>
            <li><span className="font-medium">Summary</span> → (if enabled) Key bullet-point highlights.</li>
        </ul>
        <p className="mt-2">Each section includes Copy and Download buttons for easy saving. Click “Start New” to clear results and begin again.</p>
      </div>

      <div>
        <h3 className="font-semibold text-base mb-2">🕓 5. Manage Your History</h3>
        <ul className="list-disc list-inside pl-6 text-gray-600 dark:text-gray-400">
            <li>Every transcription is auto-saved.</li>
            <li>View past jobs in the History panel (bottom-right).</li>
            <li>Click any item to reload its results instantly.</li>
            <li>Hover over an item and click the 🗑️ trash icon to delete it.</li>
            <li>Click “Clear History” to remove all saved entries at once.</li>
        </ul>
      </div>

    </div>
  );
};

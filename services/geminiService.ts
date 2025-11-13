
import { GoogleGenAI, Type } from '@google/genai';
import type { TranscriptionOptions, TranscriptionResult } from '../types';

/**
 * Sends audio data to the Gemini API for transcription, translation, and summarization.
 * @param ai - The GoogleGenAI instance.
 * @param base64data - The base64 encoded audio/video data.
 * @param mimeType - The MIME type of the audio/video file.
 * @param options - The transcription options selected by the user.
 * @returns A promise that resolves to the transcription result.
 */
export const transcribeAudio = async (
  ai: GoogleGenAI,
  base64data: string,
  mimeType: string,
  options: TranscriptionOptions
): Promise<TranscriptionResult> => {
  const { sourceLang, targetLang, doTranslate, doSummarize, summaryPoints } = options;

  let prompt = `
    You are an expert audio transcription, translation, and summarization service.
    Your task is to process the provided audio file.
    1.  First, transcribe the audio.
    2.  Detect the spoken language.
    ${sourceLang !== 'auto' ? `The user has specified that the source language is ${sourceLang}. Please prioritize this unless the detected language is clearly different.` : ''}
    ${doTranslate ? `3. Translate the transcription into ${targetLang}.` : ''}
    ${doSummarize ? `4. Create a concise summary of the transcription in ${summaryPoints} bullet points.` : ''}
    
    Please provide the output in a structured JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64data,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: { type: Type.STRING, description: 'The detected language of the audio (e.g., "English", "Spanish").' },
            transcription: { type: Type.STRING, description: 'The full transcription of the audio.' },
            ...(doTranslate && {
              translation: { type: Type.STRING, description: `The transcription translated into ${targetLang}.` },
            }),
            ...(doSummarize && {
              summary: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: `A summary of the transcription in ${summaryPoints} bullet points.`
              },
            }),
          },
          required: ['detectedLanguage', 'transcription'],
        }
      }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    const parsedResult = JSON.parse(jsonText);
    return parsedResult as TranscriptionResult;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('[403]')) {
        throw new Error('Invalid API Key. Please ensure your Gemini API key is correct and has the necessary permissions.');
    }
    
    if (errorMessage.includes('[400]')) {
        throw new Error('Unsupported audio format or corrupted file. Please use a valid MP3, WAV, MP4, or M4A file.');
    }
    
    if (errorMessage.includes('[500]') || errorMessage.includes('server error') || errorMessage.includes('xhr error')) {
      throw new Error('The API experienced a server error. This might be a temporary issue. Please try again later.');
    }
    
    throw new Error(`An unexpected error occurred: ${errorMessage}`);
  }
};

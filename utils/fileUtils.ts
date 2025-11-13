
/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Gets the duration of an audio or video file.
 * @param file The file to get the duration from.
 * @returns A promise that resolves with the formatted duration string (e.g., "01:23").
 */
export const getMediaDuration = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const mediaElement = document.createElement(
      file.type.startsWith('audio') ? 'audio' : 'video'
    );

    mediaElement.addEventListener('loadedmetadata', () => {
      const duration = mediaElement.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      URL.revokeObjectURL(url);
      resolve(formattedDuration);
    });

    mediaElement.addEventListener('error', (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load media file to get duration.'));
    });
    
    mediaElement.src = url;
  });
};

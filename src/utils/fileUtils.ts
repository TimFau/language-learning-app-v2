/**
 * Extracts the file extension from a filename.
 * @param filename The filename to extract the extension from
 * @returns The file extension, defaults to 'png' if no extension is found
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'png'; // Default to png if no extension found
}; 
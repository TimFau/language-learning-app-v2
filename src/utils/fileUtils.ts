/**
 * Extracts the file extension from a filename.
 * @param filename The filename to extract the extension from
 * @returns The file extension, defaults to 'png' if no extension is found or if filename is null/undefined
 */
export const getFileExtension = (filename: string | null | undefined): string => {
  if (!filename) return 'png';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : 'png'; // Default to png if no extension found
}; 
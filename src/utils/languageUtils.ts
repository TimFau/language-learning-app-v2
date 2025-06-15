// Map of language names to ISO 639-1 codes
const languageNameToCode: { [key: string]: string } = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Portuguese': 'pt',
    'Russian': 'ru',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Chinese': 'zh',
    'Arabic': 'ar',
    'Hindi': 'hi',
    'Turkish': 'tr',
    'Dutch': 'nl',
    'Polish': 'pl',
    'Vietnamese': 'vi',
    'Thai': 'th',
    'Indonesian': 'id',
    'Greek': 'el',
    'Hebrew': 'he'
};

/**
 * Converts a language name to its corresponding ISO 639-1 language code.
 * @param languageName The full name of the language (e.g., "Spanish")
 * @returns The ISO 639-1 language code (e.g., "es") or "en" as fallback
 */
export const getLanguageCode = (languageName: string): string => {
    if (!languageName) return 'en';
    
    // Clean up the input by removing any region specifiers and trimming
    const cleanName = languageName.split('-')[0].split('(')[0].trim().toLowerCase();
    
    // Try to find an exact match
    const code = languageNameToCode[cleanName];
    if (code) return code;
    
    // Try case-insensitive match
    const lowerName = cleanName.toLowerCase();
    const match = Object.entries(languageNameToCode).find(
        ([name]) => name.toLowerCase() === lowerName
    );
    
    return match ? match[1] : 'en';
};

export default {
    getLanguageCode
}; 
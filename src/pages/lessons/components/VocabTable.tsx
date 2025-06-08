import {
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Tooltip,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import InfoIcon from '@mui/icons-material/Info';

interface VocabItem {
  en: string;
  es?: string;
  fr?: string;
  de?: string;
  word_translations?: { [key: string]: string }; // Map of foreign words to their English translations
}

interface VocabTableProps {
  section: {
    icon: string;
    title: string | TextObject | undefined;
    description: string | TextObject | undefined;
    vocab_items: VocabItem[];
    tip?: string | TextObject | undefined;
    note?: string | TextObject | undefined;
  };
  language: 'spanish' | 'french' | 'german';
}

interface TextObject {
  type: string;
  text: string;
}

const LANGUAGE_CONFIGS = {
  spanish: {
    wordRefCode: 'es',
    speechLang: 'es',
    displayName: 'Spanish'
  },
  french: {
    wordRefCode: 'fr',
    speechLang: 'fr-FR',
    displayName: 'French'
  },
  german: {
    wordRefCode: 'de',
    speechLang: 'de-DE',
    displayName: 'German'
  },
} as const;

const LANGUAGE_KEYS = {
  spanish: 'es',
  french: 'fr',
  german: 'de'
} as const;

const speak = (text: string, lang: string = 'es') => {
  if ('speechSynthesis' in window && text) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const processedText = text.replace(/_{2,}/g, 'blank');
    const voices = synth.getVoices();
    // Try to find a voice that matches the lang exactly
    const voice = voices.find(v => v.lang === lang)
      // Or fallback to any voice that starts with the language (e.g., 'es')
      || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    const utterance = new window.SpeechSynthesisUtterance(processedText);
    utterance.lang = lang;
    if (voice) {
      utterance.voice = voice;
    }
    synth.speak(utterance);
  }
};

const normalizeSpanishText = (text: string): string => {
  return text
    .toLowerCase()
    // Remove leading/trailing punctuation
    .replace(/[¿¡?!.,]/g, '');
};

const renderForeignPhrase = (phrase: string, englishTranslation: string, language: 'spanish' | 'french' | 'german', wordTranslations?: { [key: string]: string }) => {
  const words = phrase.split(' ');
  
  if (words.length <= 1) {
    return phrase;
  }

  // Create normalized dictionary
  const normalizedTranslations = wordTranslations 
    ? Object.entries(wordTranslations).reduce((acc, [key, value]) => {
        acc[normalizeSpanishText(key)] = value;
        return acc;
      }, {} as { [key: string]: string })
    : {};

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    event.preventDefault();
    // Remove any punctuation marks for the search
    const searchWord = word.replace(/[¿¡?!.,]/g, '');
    const langConfig = LANGUAGE_CONFIGS[language];
    window.open(`https://www.wordreference.com/${langConfig.wordRefCode}/en/translation.asp?spen=${encodeURIComponent(searchWord)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <span className="foreign-phrase">
      {words.map((word, index) => {
        const normalizedWord = normalizeSpanishText(word);
        const translation = normalizedTranslations[normalizedWord];
        return translation ? (
          <Tooltip 
            key={index} 
            title={
              <div>
                {translation}
                <br />
                <small style={{ opacity: 0.8 }}>Click for full definition & conjugation</small>
              </div>
            }
            placement="top"
            arrow
          >
            <a 
              href={`https://www.wordreference.com/${LANGUAGE_CONFIGS[language].wordRefCode}/en/translation.asp?spen=${encodeURIComponent(word.replace(/[¿¡?!.,]/g, ''))}`}
              className="hoverable-word"
              onClick={(e) => handleWordClick(word, e)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {word}
            </a>
          </Tooltip>
        ) : (
          <span key={index}>{word}</span>
        );
      })}
    </span>
  );
};

export default function VocabTable({ section, language }: VocabTableProps) {
  const langConfig = LANGUAGE_CONFIGS[language];
  const langKey = LANGUAGE_KEYS[language];

  const renderText = (text: string | TextObject | undefined) => {
    if (typeof text === 'object' && text !== null) {
      return text.text || '';
    }
    return text || '';
  };

  return (
    <Box className="vocab-table-section">
      <Typography variant="h4" component="h2" className="vocab-table-title">
        <Icon>{section.icon}</Icon> {renderText(section.title)}
      </Typography>
      <Typography
        variant="body1"
        className="vocab-table-description"
        gutterBottom
      >
        {renderText(section.description)}
      </Typography>

      <TableContainer component={Paper} className="vocab-table-container">
        <Table aria-label="vocabulary table" className="vocab-table">
          <TableHead>
            <TableRow>
              <TableCell>English</TableCell>
              <TableCell>
                {LANGUAGE_CONFIGS[language].displayName}
                <Tooltip title={`Hover over words to see individual translations`} arrow placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.7 }} />
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.vocab_items.map((item, index) => {
              const foreignText = item[langKey];
              return (
                <TableRow key={index}>
                  <TableCell className="vocab-table-cell vocab-table-cell-term">{item.en}</TableCell>
                  <TableCell className="vocab-table-cell vocab-table-cell-translation">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {foreignText && renderForeignPhrase(foreignText, item.en, language, item.word_translations)}
                      <Button
                        aria-label="Pronounce word"
                        onClick={() => speak(foreignText || '', langConfig.speechLang)}
                        size="small"
                        className="pronounce-btn"
                      >
                        <VolumeUpIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {section.tip && (
        <Typography variant="body2" className="vocab-table-tip">
          <Icon>lightbulb</Icon> {renderText(section.tip)}
        </Typography>
      )}
      {section.note && (
        <Typography variant="body2" className="vocab-table-note">
          <Icon>info</Icon> {renderText(section.note)}
        </Typography>
      )}
    </Box>
  );
} 
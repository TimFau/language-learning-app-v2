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
import { useState } from 'react';

interface VocabItem {
  en: string;
  es: string;
  word_translations?: { [key: string]: string }; // Map of Spanish words to their English translations
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
}

interface TextObject {
  type: string;
  text: string;
}

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
    .replace(/^[¿¡]+|[?.!]+$/g, '')
    // Normalize accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const renderSpanishPhrase = (phrase: string, englishTranslation: string, wordTranslations?: { [key: string]: string }) => {
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

  return (
    <span className="spanish-phrase">
      {words.map((word, index) => {
        const normalizedWord = normalizeSpanishText(word);
        const translation = normalizedTranslations[normalizedWord];
        return translation ? (
          <Tooltip 
            key={index} 
            title={translation}
            placement="top"
            arrow
          >
            <span className="hoverable-word">{word}</span>
          </Tooltip>
        ) : (
          <span key={index}>{word}</span>
        );
      })}
    </span>
  );
};

export default function VocabTable({ section }: VocabTableProps) {
  const [showTip, setShowTip] = useState(true);

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
      
      {showTip && (
        <Box className="vocab-table-hover-tip" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon fontSize="small" color="info" />
          <Typography variant="body2" color="info.main">
            Hover over individual Spanish words to see their translations
            <Button size="small" onClick={() => setShowTip(false)} sx={{ ml: 2 }}>
              Got it
            </Button>
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} className="vocab-table-container">
        <Table aria-label="vocabulary table" className="vocab-table">
          <TableHead>
            <TableRow>
              <TableCell>English</TableCell>
              <TableCell>
                Spanish
                <Tooltip title="Hover over words to see individual translations" arrow placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.7 }} />
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.vocab_items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="vocab-table-cell vocab-table-cell-term">{item.en}</TableCell>
                <TableCell className="vocab-table-cell vocab-table-cell-translation">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {renderSpanishPhrase(item.es, item.en, item.word_translations)}
                    <Button
                      aria-label="Pronounce word"
                      onClick={() => speak(item.es, 'es')}
                      size="small"
                      className="pronounce-btn"
                    >
                      <VolumeUpIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
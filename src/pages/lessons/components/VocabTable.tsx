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
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface VocabItem {
  en: string;
  es: string;
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

export default function VocabTable({ section }: VocabTableProps) {
  const renderText = (text: string | TextObject | undefined) => {
    if (typeof text === 'object' && text !== null) {
      return text.text;
    }
    return text;
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
              <TableCell>Spanish</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.vocab_items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="vocab-table-cell vocab-table-cell-term">{item.en}</TableCell>
                <TableCell className="vocab-table-cell vocab-table-cell-translation">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.es}
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
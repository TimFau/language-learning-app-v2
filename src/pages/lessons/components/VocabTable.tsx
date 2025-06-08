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
  Tooltip,
  Box,
} from '@mui/material';

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
                <TableCell>{item.en}</TableCell>
                <TableCell>{item.es}</TableCell>
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
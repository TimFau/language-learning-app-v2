import { Box, Typography, Button, Icon } from '@mui/material';

interface CalloutText {
  type: string;
  text: string;
}

interface CalloutProps {
  section: {
    icon: string;
    title: string;
    text: string | CalloutText;
    link?: {
      label: string;
      url: string;
    };
  };
  deckLink?: string; // Optional deck link that can override section.link.url
}

export default function Callout({ section, deckLink }: CalloutProps) {
  const renderText = () => {
    if (typeof section.text === 'object' && section.text !== null) {
      return section.text.text || '';
    }
    return section.text || '';
  };

  // Determine the link URL and label
  const linkUrl = deckLink || section.link?.url;
  const linkLabel = section.link?.label || 'Try Now';

  return (
    <Box className="callout-section">
      <Typography variant="h5" component="h3" className="callout-title">
        <Icon>{section.icon}</Icon> {section.title}
      </Typography>
      <Typography variant="body1" className="callout-text">
        {renderText()}
      </Typography>
      {linkUrl && (
        <Button
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          className="callout-link"
        >
          {linkLabel}
        </Button>
      )}
    </Box>
  );
} 
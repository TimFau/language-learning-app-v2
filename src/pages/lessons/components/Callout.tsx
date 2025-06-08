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
}

export default function Callout({ section }: CalloutProps) {
  const renderText = () => {
    if (typeof section.text === 'object' && section.text !== null) {
      return section.text.text || '';
    }
    return section.text || '';
  };

  return (
    <Box className="callout-section">
      <Typography variant="h5" component="h3" className="callout-title">
        <Icon>{section.icon}</Icon> {section.title}
      </Typography>
      <Typography variant="body1" className="callout-text">
        {renderText()}
      </Typography>
      {section.link && (
        <Button
          href={section.link.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          className="callout-link"
        >
          {section.link.label}
        </Button>
      )}
    </Box>
  );
} 
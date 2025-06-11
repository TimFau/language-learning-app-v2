import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import type { GraphQLError } from 'graphql';
import { useContext, useState } from 'react';
import AuthContext from '../context/auth-context';
import { SAVE_TERM, CHECK_TERM_SAVED } from '../queries';

interface SaveToBankProps {
  term: string;
  definition: string;
  language: string;
  className?: string;
}

export default function SaveToBank({ term, definition, language, className }: SaveToBankProps) {
  const authCtx = useContext(AuthContext);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  
  // Check if term is already saved
  const { data: savedData, loading: checkingStatus } = useQuery(CHECK_TERM_SAVED, {
    variables: { term, language },
    context: {
      headers: {
        authorization: `Bearer ${authCtx.userToken}`
      }
    },
    skip: !authCtx.userToken
  });

  const [saveTerm] = useMutation(SAVE_TERM, {
    context: {
      headers: {
        authorization: `Bearer ${authCtx.userToken}`
      }
    },
    // Refetch the check query after saving
    refetchQueries: [
      {
        query: CHECK_TERM_SAVED,
        variables: { term, language }
      }
    ]
  });

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!authCtx.userToken) {
      authCtx.onLoginOpen(true, false);
      return;
    }

    setIsSaving(true);
    setSaveError(false);

    try {
      await saveTerm({
        variables: {
          term,
          definition,
          language,
          user: authCtx.userId
        }
      });
      // Success state is handled by the isAlreadySaved check
    } catch (err: any) {
      // If token is invalid, trigger login dialog
      if (err.graphQLErrors?.some((e: GraphQLError) => 
        e.extensions?.code === 'INVALID_TOKEN' || 
        e.extensions?.code === 'INVALID_CREDENTIALS'
      )) {
        authCtx.onLogout();
        authCtx.onLoginOpen(true, false);
        return;
      }

      setSaveError(true);
      console.error("❌ Failed to save term:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isAlreadySaved = savedData?.saved_terms?.length > 0;

  // Determine button state
  const getButtonProps = () => {
    if (isAlreadySaved) {
      return {
        startIcon: <CheckCircleIcon />,
        color: 'success' as const,
        children: 'Saved',
        sx: { 
          minWidth: 'auto',
          padding: '4px 8px',
          opacity: 0.7,
          '&:hover': {
            opacity: 0.7,
            cursor: 'default'
          }
        }
      };
    }

    if (saveError) {
      return {
        startIcon: <ErrorIcon />,
        color: 'error' as const,
        children: 'Retry',
        sx: { 
          minWidth: 'auto',
          padding: '4px 8px',
          opacity: 0.9,
          '&:hover': {
            opacity: 1
          }
        }
      };
    }

    return {
      startIcon: <SaveIcon />,
      color: 'secondary' as const,
      children: isSaving ? 'Saving...' : 'Save',
      sx: { 
        minWidth: 'auto',
        padding: '4px 8px',
        opacity: 0.7,
        '&:hover': {
          opacity: 1
        },
        '&.Mui-disabled': {
          opacity: 0.5
        }
      }
    };
  };

  const buttonProps = getButtonProps();

  return (
    <Button 
      onClick={handleSave}
      variant="text"
      disabled={(!authCtx.userToken || checkingStatus || isSaving || isAlreadySaved)}
      className={className}
      {...buttonProps}
    />
  );
} 
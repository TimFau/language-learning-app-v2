import { useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import type { GraphQLError } from 'graphql';
import { useContext } from 'react';
import AuthContext from '../context/auth-context';
import { SAVE_TERM } from '../queries';

export default function SaveTestButton() {
  const authCtx = useContext(AuthContext);
  
  const [saveTerm] = useMutation(SAVE_TERM, {
    context: {
      headers: {
        authorization: `Bearer ${authCtx.userToken}`
      }
    }
  });

  const handleClick = async () => {
    if (!authCtx.userToken || !authCtx.userId) {
      console.error("❌ Not logged in");
      authCtx.onLoginOpen(true, false);
      return;
    }

    try {
      const { data } = await saveTerm({
        variables: {
          term: "despertarse",
          definition: "to wake up (reflexive)",
          language: "es"
        }
      });
      console.log("✅ Term saved:", data);
    } catch (err: any) {
      // If token is invalid, trigger login dialog
      if (err.graphQLErrors?.some((e: GraphQLError) => 
        e.extensions?.code === 'INVALID_TOKEN' || 
        e.extensions?.code === 'INVALID_CREDENTIALS'
      )) {
        authCtx.onLogout();
        authCtx.onLoginOpen(true, false);
        console.error("❌ Authentication error. Please log in again.");
        return;
      }

      console.error("❌ Failed to save term:", {
        message: err.message,
        graphQLErrors: err.graphQLErrors?.map((e: GraphQLError) => ({
          message: e.message,
          path: e.path,
          extensions: e.extensions
        })),
        networkError: err.networkError,
        extraInfo: err.extraInfo
      });
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outlined"
      color="secondary"
      size="small"
      sx={{ marginLeft: 1 }}
      disabled={!authCtx.userToken}
    >
      Test Save Term
    </Button>
  );
} 
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import AuthContext, { AuthContextProvider } from 'context/auth-context';
import { ModalContextProvider } from 'context/modal-context';

import MainLayout from './layouts/Main';

import './css/main.scss';
import { useContext, useEffect } from 'react';

declare module '@mui/system' {
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  palette: {
    primary: {
      light: '#333366',
      main: '#1A1A40',
      dark: '#00001a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#F9B75C',
      main: '#F7931E',
      dark: '#C96A00',
      contrastText: '#fff',
    },
    background: {
      default: '#FDFCFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A40',
      secondary: '#444444',
    },
    success: {
      main: '#69a769',
      contrastText: '#fff',
    },
    warning: {
      main: '#F7931E',
      contrastText: '#fff',
    },
    info: {
      main: '#1A1A40',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      contrastText: '#fff',
    },
  },
});

// Create an instance of ApolloClient
export const client = new ApolloClient({
  uri: import.meta.env.VITE_API_BASE,
  cache: new InMemoryCache(),
});

function AppContent() {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (!authContext.authLoading && authContext.userToken) {
        rootElement.classList.add('logged-in');
      } else {
        rootElement.classList.remove('logged-in');
      }
    }
  }, [authContext.authLoading, authContext.userToken]);

  return (
    <>
      <MainLayout />
    </>
  );
}

export default function TranslationApp() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <ApolloProvider client={client}>
          <BrowserRouter basename="/">
            <ThemeProvider theme={theme}>
              <AppContent />
            </ThemeProvider>
          </BrowserRouter>
        </ApolloProvider>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}
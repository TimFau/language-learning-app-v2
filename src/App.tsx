import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { AuthContextProvider } from 'context/auth-context';
import { ModalContextProvider } from 'context/modal-context';

import MainLayout from './layouts/Main';

import './css/main.scss';

declare module '@mui/system' {
  interface DefaultTheme extends Theme {}
}

const theme = createTheme({
  palette: {
    primary: {
      light: '#677E9D',
      main: '#677E9D',
      dark: '#677E9D',
      contrastText: '#fff',
    },
    secondary: {
      light: '#261F3C',
      main: '#261F3C',
      dark: '#261F3C',
      contrastText: '#fff',
    }
  },
});

// Create an instance of ApolloClient
export const client = new ApolloClient({
  uri: import.meta.env.VITE_API_BASE,
  cache: new InMemoryCache(),
});

export default function TranslationApp() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <ApolloProvider client={client}>
          <BrowserRouter basename="/">
            <ThemeProvider theme={theme}>
              <MainLayout />
            </ThemeProvider>
          </BrowserRouter>
        </ApolloProvider>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}
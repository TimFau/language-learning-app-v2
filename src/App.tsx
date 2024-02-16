import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { AuthContextProvider } from 'context/auth-context';

import RootPage from './pages/RootPage';

import './css/main.scss';

const theme = createTheme(adaptV4Theme({
	palette: {
	  primary: {
		light: '#AD95A4',
		main: '#AD95A4',
		dark: '#AD95A4',
		contrastText: '#fff',
	  },
	  secondary: {
		light: '#261F3C',
		main: '#261F3C',
		dark: '#261F3C',
		contrastText: '#fff',
	  }
	},
}));

export default function TranslationApp() {
	return (
		<AuthContextProvider>
		<BrowserRouter>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<RootPage />
				</ThemeProvider>
			</StyledEngineProvider>
		</BrowserRouter>
		</AuthContextProvider>
	);
}

import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { AuthContextProvider } from 'context/auth-context';

import RootPage from './pages/RootPage';

import './css/main.scss';

const theme = createTheme(adaptV4Theme({
	palette: {
	  primary: {
		light: '#80c2ff',
		main: '#1273E6',
		dark: '#0065bd',
		contrastText: '#fff',
	  },
	  secondary: {
		light: '#4e5486',
		main: '#212c59',
		dark: '#00002f',
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

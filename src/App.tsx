import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { AuthContextProvider } from 'context/auth-context';

import RootPage from './pages/RootPage';

import './css/main.scss';

const theme = createTheme(adaptV4Theme({
	palette: {
	  primary: {
		light: '#FAF9F8',
		main: '#4478BB',
		dark: '#4478BB',
		contrastText: '#fff',
	  },
	  secondary: {
		light: '#F4A583',
		main: '#9B89D6',
		dark: '#6F5AB0',
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

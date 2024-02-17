import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { AuthContextProvider } from 'context/auth-context';
import { ModalContextProvider } from 'context/modal-context';

import MainLayout from './layouts/Main';

import './css/main.scss';

const theme = createTheme(adaptV4Theme({
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
}));

export default function TranslationApp() {
	return (
		<AuthContextProvider>
		<ModalContextProvider>
		<BrowserRouter>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<MainLayout />
				</ThemeProvider>
			</StyledEngineProvider>
		</BrowserRouter>
		</ModalContextProvider>
		</AuthContextProvider>
	);
}

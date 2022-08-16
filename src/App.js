import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';

import MainApp from './components/MainApp/MainApp';
import {getCookie} from './scripts/Helpers';
import Cookies from 'universal-cookie';

import './css/main.scss';

// Global Vars
const cookies = new Cookies();

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

class TranslationApp extends React.Component {
	componentDidMount () {
		if (getCookie('token')) {
			this.props.setUserToken(cookies.get('token'));
		}
	}
	render() {
    	return (
            <BrowserRouter>
				<StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <MainApp />
                    </ThemeProvider>
                </StyledEngineProvider>
			</BrowserRouter>
        );
	}
}

const mapDispatchToProps = dispatch => {
    return {
        setUserToken: (value) => dispatch({type: 'user/setToken', value: value})
    };
};

export default connect(null, mapDispatchToProps)(TranslationApp);
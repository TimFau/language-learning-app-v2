import React, { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import {cookieExists} from './../scripts/Helpers';

interface IAuthContext {
    userToken: string,
    isNewUser: boolean,
    loginOpen: boolean,
    onLogout: () => void,
    onLogin: (value: string) => void,
    onLoginOpen: (open: boolean, newUser: boolean) => void
}

const defaultState = {
    userToken: '',
    isNewUser: false,
    loginOpen: false,
    onLogout: () => {},
    onLogin: () => {},
    onLoginOpen: () => {}
}

const cookies = new Cookies();

const AuthContext = React.createContext<IAuthContext>(defaultState);

export const AuthContextProvider = (props: any) => {
    const [userToken, setUserToken] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
		if (cookieExists('token')) {
            console.log('Authenticatin Cookie Exists: Setting userToken state')
			setUserToken(cookies.get('token'));
		}
	}, [])

    const logoutHandler = () => {
        console.log('logoutHandler')
        cookies.remove('token', { path: '/' });
        setUserToken('');
        setIsNewUser(false);
    }

    const loginHandler = (value: string) => {
        console.log('loginHandler')
        let cookieExpires = new Date();
        cookieExpires.setMinutes(cookieExpires.getMinutes() + 20);
        cookies.set('token', value, { path: '/', expires: cookieExpires });
        setUserToken(value);
        setLoginOpen(false);
        setIsNewUser(false);
    }

    const loginDialogHandler = (isOpen: boolean, newUser: boolean) => {
        setLoginOpen(isOpen);
        setIsNewUser(newUser);
    }

    return <AuthContext.Provider
        value={{ 
            userToken: userToken,
            isNewUser: isNewUser,
            loginOpen: loginOpen,
            onLogout: logoutHandler,
            onLogin: loginHandler,
            onLoginOpen: loginDialogHandler
        }}
    >
        {props.children}
    </AuthContext.Provider>;
}

export default AuthContext;
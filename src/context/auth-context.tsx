import React, { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import {cookieExists} from './../scripts/Helpers';

interface IAuthContext {
    userToken: string,
    userId: string,
    isNewUser: boolean,
    loginOpen: boolean,
    onLogout: () => void,
    onLogin: (accessToken: string, userId: string) => void,
    onLoginOpen: (open: boolean, newUser: boolean) => void
}

const defaultState = {
    userToken: '',
    userId: '',
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
    const [userId, setUserId] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
		if (cookieExists('token')) {
            console.log('Authentication Cookie Exists: Setting userToken state')
			setUserToken(cookies.get('token'));
		}
        if (cookieExists('userId')) {
            console.log('userId Cookie Exists: Setting userId state')
			setUserId(cookies.get('userId'));
		}
	}, [])

    const logoutHandler = () => {
        console.log('logoutHandler')
        cookies.remove('token', { path: '/' });
        setUserToken('');
        setIsNewUser(false);
    }

    const loginHandler = (accessToken: string, usersId: string) => {
        console.log('loginHandler')
        let cookieExpires = new Date();
        cookieExpires.setMinutes(cookieExpires.getMinutes() + 20);
        cookies.set('token', accessToken, { path: '/', expires: cookieExpires });
        cookies.set('userId', usersId, { path: '/', expires: cookieExpires });
        setUserToken(accessToken);
        setUserId(usersId);
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
            userId: userId,
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
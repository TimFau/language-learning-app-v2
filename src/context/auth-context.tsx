import React, { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import {cookieExists} from './../scripts/Helpers';

interface IAuthContext {
    userToken: string,
    userId: string,
    userName: string,
    isNewUser: boolean,
    loginOpen: boolean,
    onLogout: () => void,
    onLogin: (accessToken: string, userId: string, userName: string) => void,
    onLoginOpen: (open: boolean, newUser: boolean) => void
}

const defaultState = {
    userToken: '',
    userId: '',
    userName: '',
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
    const [userName, setUserName] = useState('');
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
        if (cookieExists('userName')) {
            console.log('userName Cookie Exists: Setting userName state')
			setUserName(cookies.get('userName'));
		}
	}, [])

    const logoutHandler = () => {
        console.log('logoutHandler')
        cookies.remove('token', { path: '/' });
        cookies.remove('userId', { path: '/' });
        cookies.remove('userName', { path: '/' });
        setUserToken('');
        setUserId('');
        setUserName('');
        setIsNewUser(false);
    }

    const loginHandler = (accessToken: string, usersId: string, userName: string) => {
        console.log('loginHandler')
        cookies.set('token', accessToken, { path: '/' });
        cookies.set('userId', usersId, { path: '/' });
        cookies.set('userName', userName, { path: '/' });
        setUserToken(accessToken);
        setUserId(usersId);
        setUserName(userName);
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
            userName,
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
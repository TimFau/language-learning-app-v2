import React, { useState } from "react";

interface IAuthContext {
    userToken: string,
    token: string
}

const defaultState = {
    userToken: '',
    token: ''
}

const AuthContext = React.createContext<IAuthContext>(defaultState);

export const AuthContextProvider = (props: any) => {
    const [userToken] = useState('');
    const [token] = useState('');

    return <AuthContext.Provider
        value={{ 
            userToken: userToken,
            token: token
        }}
    >
        {props.children}
    </AuthContext.Provider>;
}

export default AuthContext;
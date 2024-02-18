import { useEffect, useState, useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import { CircularProgress } from '@mui/material';
import UserDecks from '../../components/Authenticated/UserDecks';
import AuthContext from 'context/auth-context';
import userService from 'services/userService';

export default function Account() {

    const authCtx = useContext(AuthContext);
    const userName = useAppSelector((state) => state.userName)
    const [userId, setUserId] = useState('');
    const [isReady, setIsReady] = useState(false);
    const dispatch = useAppDispatch();

    function getAccountDetails() {
        userService.getAccountDetails(authCtx.userToken)
        .then(async response => {
            const data = await response;
            if(data.errors) {
                console.log('bad response', response)
                const errorMessages = data.errors.map((error: any) => error.message);
                authCtx.onLogout()
                authCtx.onLoginOpen(true, false);
                throw new Error(errorMessages);
            }
            dispatch({type: 'user/setUserName', value: data.users_me.first_name})
            setUserId(data.users_me.id)
            setIsReady(true)
            return true
        })
        .catch(error => {
            console.error('catch', error);
        })
    }

    useEffect(function () {
        getAccountDetails();
    })
    
    return (
        <div className="container page-container">
            <div className="wrapper" id="account">
                {isReady ? 
                <UserDecks userId={userId} userName={userName} />
                :
                <CircularProgress />
                }
            </div>
        </div>
    )
}
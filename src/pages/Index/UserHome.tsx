import { useEffect, useState, useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import { CircularProgress, Typography, LinearProgress } from '@mui/material';
import UserDecks from '../../components/Authenticated/UserDecks';
import AuthContext from 'context/auth-context';
import userService from 'services/userService';
import DeckCardSkeleton from '../../components/DeckCardSkeleton';
import ColdStartMessage from '../../components/ColdStartMessage';

export default function Account() {

    const authCtx = useContext(AuthContext);
    const userName = useAppSelector((state) => state.userName)
    const [userId, setUserId] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [isColdStart, setIsColdStart] = useState(false);
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
            // Handle token expiration (401 Unauthorized)
            if (error && error.networkError && error.networkError.statusCode === 401) {
                authCtx.onLogout();
                authCtx.onLoginOpen(true, false);
                return;
            }
            console.error('catch', error);
        })
    }

    useEffect(function () {
        getAccountDetails();
    }, []);

    useEffect(() => {
        if (!isReady) {
            const timer = setTimeout(() => setIsColdStart(true), 4000);
            return () => clearTimeout(timer);
        } else {
            setIsColdStart(false);
        }
    }, [isReady]);

    // Scroll to top on mount (fixes mobile reload issue)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <div className="container page-container">
            <div className="wrapper" id="account">
                {isReady ? 
                <UserDecks userId={userId} userName={userName} />
                :
                isColdStart ? (
                    <ColdStartMessage maxSeconds={30} />
                ) : (
                    <div className="decks-container">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <DeckCardSkeleton key={idx} />
                        ))}
                    </div>
                )
                }
            </div>
        </div>
    )
}
import { useEffect, useState, useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import { CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import UserLists from './UserLists';
import AuthContext from 'context/auth-context';

const useStyles = makeStyles({
    wrapper: {
      marginTop: '25px'
    }
});

export default function Account() {

    const authCtx = useContext(AuthContext);
    const userName = useAppSelector((state) => state.userName)
    const [userId, setUserId] = useState('');
    const [isReady, setIsReady] = useState(false);
    const dispatch = useAppDispatch();
    const classes = useStyles();
    const endpoint = `${process.env.REACT_APP_API_BASE}/system`;

    function getAccountDetails() {
        fetch(endpoint + "?access_token=" + authCtx.userToken, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                query {
                    users_me {
                        first_name
                        email
                        id
                    }
                }
                `
            })
        })
        .then(async response => {
            const data = await response.json();
            if(!response.ok) {
                console.log('bad response', response)
                const resError = (data && data.message) || response.status;
                authCtx.onLogout()
                authCtx.onLoginOpen(true, false);
                return Promise.reject(resError);
            }
                dispatch({type: 'user/setUserName', value: data.data.users_me.first_name})
                setUserId(data.data.users_me.id)
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
        <div className="container main-container">
            <div className={classes.wrapper + ' wrapper'} id="account">
                {isReady ? 
                <div>
                    <h1>Welcome, {userName}</h1>
                    <UserLists userId={userId} />
                </div>
                :
                <CircularProgress />
                }
            </div>
        </div>
    )
}
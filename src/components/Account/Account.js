/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, makeStyles } from '@material-ui/core';
import UserLists from './UserLists';

const useStyles = makeStyles({
    wrapper: {
      marginTop: '25px'
    }
});

export default function account(props) {

    const userToken = useSelector((state) => state.token)
    const userName = useSelector((state) => state.userName)
    const [userId, setUserId] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const endpoint = 'https://d3pdj2cb.directus.app/graphql/system';

    function getAccountDetails() {
        fetch(endpoint + "?access_token=" + userToken, {
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
                const resError = (data && data.message) || response.status;
                return Promise.reject(resError);
            }
            console.log(data)
            dispatch({type: 'user/setUserName', value: data.data.users_me.first_name})
            setUserId(data.data.users_me.id)
            setIsReady(true)
        })
        .catch(error => {
            console.error('catch', error);
        })
    }

    useEffect(function () {
        getAccountDetails();
    }) 
    
    
    return (
        <div className={classes.wrapper + ' wrapper'} id="account">
            {isReady ? 
            <div>
                <h1>Welcome, {userName}</h1>
                <UserLists userId={userId} deckOptions={props.deckOptions} />
            </div>
            :
            <CircularProgress />
            }
        </div>
    )
}
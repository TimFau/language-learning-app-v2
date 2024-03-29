import React, { useContext, useState } from 'react';
import userService from 'services/userService';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AuthContext from 'context/auth-context';

export default function Login() {

    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const authCtx = useContext(AuthContext);

    function login() {
        userService.login(email, password)
        .then(async response => {
            const data = await response;
            setEmailError('');
            setPassError('');
            if (data.errors) {
                const errorMsgs = data.errors;
                for (let i = 0; i < errorMsgs.length; i++) {
                    let errorMsg = errorMsgs[i].message;
                    if(errorMsg.includes('Invalid user credentials')) {
                        setEmailError('Invalid username or password');
                        setPassError("Invalid username or password");
                    }
                    if(errorMsg.includes('email')) {
                        setEmailError('Please enter a valid email address');
                    }
                    if(errorMsg.includes('password')) {
                        setPassError("Please enter your password");
                    }
                }
                return false
            } else {
                const userDetails = await userService.getAccountDetails(data.auth_login.access_token).then(response => response)
                const accessToken = data.auth_login.access_token
                const userId = userDetails.users_me.id
                const userName = userDetails.users_me.username
                authCtx.onLogin(accessToken, userId, userName)
                return true
            }
        })
        .catch(error => {
            console.error('login catch', error, error.message);
            if (error.message.includes('Invalid user credentials.')) {
                alert('Invalid user credentials.');
            }
        })
    }

    function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    return (
        <Dialog open={authCtx.loginOpen} onClose={() => authCtx.onLoginOpen(false, false)} className="login-dialog">
            <DialogTitle>
                {authCtx.isNewUser ? 'Account Created!' : 'Login'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {authCtx.isNewUser && 'Please login below'}
                </DialogContentText>
                <TextField 
                    autoFocus
                    margin="dense"
                    value={email}
                    onChange={handleEmail} 
                    error={emailError !== ''}
                    helperText={emailError}
                    label="Email Address"
                    fullWidth
                    variant="standard"
                />
                <TextField 
                    margin="dense"
                    value={password}
                    onChange={handlePassword} 
                    error={passError !== ''}
                    helperText={passError}
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => login()}
                    variant="contained"
                    color="primary"
                >Login</Button>
            </DialogActions>
        </Dialog>
    )
}
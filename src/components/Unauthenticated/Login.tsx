import React, { useContext, useState, useEffect } from 'react';
import userService from 'services/userService';
import FetchErrorMessage from './FetchErrorMessage';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AuthContext from 'context/auth-context';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ColdStartMessage from 'components/ColdStartMessage';

export default function Login() {

    const [emailError, setEmailError] = useState('');
    const [passError, setPassError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isColdStart, setIsColdStart] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        if (loading) {
            setApiError(null);
            const timer = setTimeout(() => setIsColdStart(true), 4000);
            return () => clearTimeout(timer);
        } else {
            setIsColdStart(false);
            return undefined;
        }
    }, [loading]);

    function login(event?: React.FormEvent<HTMLFormElement>) {
        if (event) event.preventDefault();
        // Reset errors
        setEmailError('');
        setPassError('');
        setApiError(null);

        let hasError = false;

        // Validate required fields
        if (!email) {
            setEmailError('Please enter a valid email address');
            hasError = true;
        }
        if (!password) {
            setPassError('Please enter your password');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(true);
        userService.login(email, password)
        .then(async response => {
            const data = await response;
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
                setLoading(false);
                return false
            } else {
                const userDetails = await userService.getAccountDetails(data.auth_login.access_token).then(response => response)
                const accessToken = data.auth_login.access_token
                const userId = userDetails.users_me.id
                const userName = userDetails.users_me.username
                authCtx.onLogin(accessToken, userId, userName)
                setLoading(false);
                return true
            }
        })
        .catch(error => {
            console.error('login catch', error, error.message);
            if (error.message.includes('Invalid user credentials.')) {
                alert('Invalid user credentials.');
            }
            setApiError(error.message || 'An unexpected error occurred.');
            setLoading(false);
        })
    }

    function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
        // Clear error when user starts typing
        if (emailError) setEmailError('');
    }

    function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        // Clear error when user starts typing
        if (passError) setPassError('');
    }

    return (
        <Dialog
            open={authCtx.loginOpen}
            onClose={() => authCtx.onLoginOpen(false, false)}
            className="login-dialog"
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: { borderRadius: 3, p: 2 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 0, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 24, color: '#23234B' }}>
                    {authCtx.isNewUser ? 'Account Created!' : 'Log in'}
                </span>
                <IconButton
                    aria-label="close"
                    onClick={() => authCtx.onLoginOpen(false, false)}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                    data-testid="login-close-button"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
                {apiError ? (
                    <FetchErrorMessage error={apiError} onRetry={() => setApiError(null)} title="Error" />
                ) : (
                <form style={{ width: '100%' }} onSubmit={login}>
                    <TextField
                        autoFocus
                        margin="dense"
                        value={email}
                        onChange={handleEmail}
                        error={emailError !== ''}
                        helperText={emailError}
                        label="Email Address"
                        fullWidth
                        variant="outlined"
                        inputProps={{ "data-testid": "login-email-input" } as any}
                        type="email"
                        sx={{ mb: 2 }}
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
                        variant="outlined"
                        inputProps={{ "data-testid": "login-password-input" } as any}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        data-testid="login-submit-button"
                        disabled={loading}
                        fullWidth
                        sx={{ mt: 1, mb: 1 }}
                    >
                        {loading ? (
                            isColdStart ? <ColdStartMessage maxSeconds={30} /> : <CircularProgress size={24} color="inherit" />
                        ) : 'Log in'}
                    </Button>
                </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
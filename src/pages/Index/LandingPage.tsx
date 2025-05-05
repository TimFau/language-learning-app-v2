import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import AuthContext from 'context/auth-context';
import userService from 'services/userService';

import DemoDecksDrawer from '../Deck/components/DemoDecksDrawer';

import { Paper, Card, TextField, Button, Link } from '@mui/material/';
import makeStyles from '@mui/styles/makeStyles';
import { Alert } from '@mui/material';
import { CheckIsEmail } from '../../scripts/Helpers';

//
// This Page is served to guests or users that have been logged out
//

const useStyles = makeStyles({
    alert: {
        marginBottom: "25px"
    }
});

type LoggedOutProps = {
    open: boolean,
    onClose: (event: React.UIEvent<HTMLElement>) => void,
}

export default function GuestPage(props: LoggedOutProps) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');
    
    // State for API/general errors (top alert)
    const [alertMsgs, setAlertMsgs] = React.useState<string[]>([]);
    
    // State for inline field validation errors
    const [firstNameError, setFirstNameError] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const authCtx = useContext(AuthContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'firstName':
                setFirstName(value);
                if (firstNameError) setFirstNameError(''); // Clear error on change
                break;
            case 'lastName':
                setLastName(value);
                if (lastNameError) setLastNameError(''); // Clear error on change
                break;
            case 'email':
                setUserEmail(value);
                if (emailError) setEmailError(''); // Clear error on change
                break;
            case 'password':
                setUserPassword(value);
                if (passwordError) setPasswordError(''); // Clear error on change
                break;
            default:
                console.log('No match for event name')
        }
    }

    function validateFields () {
        // Clear previous field errors
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');
        let isValid = true;

        if (firstName === '') {
            setFirstNameError('Please enter your first name.');
            isValid = false;
        }
        if (lastName === '') {
            setLastNameError('Please enter your last name.');
            isValid = false;
        }
        if (userEmail === '') {
            setEmailError('Please enter your email address.');
            isValid = false;
        } else if (!CheckIsEmail(userEmail)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        }
        if (userPassword === '') {
            setPasswordError('Please enter a password.');
            isValid = false;
        }
        
        // Clear top alert if all fields are now valid
        if (isValid) {
            setAlertMsgs([]);
        }
        
        return isValid;
    }

    function createAccount() {
        // Clear previous API errors before attempting
        setAlertMsgs([]);

        if (validateFields()) {
            createAccountPost()
        }
        function createAccountPost() {
            return userService.createAccount(firstName, lastName, userEmail, userPassword)
            .then(async response => {
                const data = await response;
                if (data.errors) {
                    const errorMsgs = data.errors;
                    let apiErrors: string[] = []; 
                    for (let i = 0; i < errorMsgs.length; i++) {
                        let errorMsg = errorMsgs[i].message;
                        if (errorMsg.includes('Field \"email\" has to be unique.')) {
                            setEmailError('You are already registered with this email address.'); 
                            apiErrors.push('You are already registered with this email address.');
                        } else if (errorMsg.includes('This value is not a valid email address.')) {
                            setEmailError('Please enter a valid email address.'); 
                            apiErrors.push('Please enter a valid email address.');
                        } else {
                            apiErrors.push(errorMsg); 
                        }
                    }
                    setAlertMsgs(apiErrors);
                    return; 
                } else {
                    try {
                        const loginResponse = await userService.login(userEmail, userPassword);
                        if (loginResponse.auth_login?.access_token) {
                            const userDetails = await userService.getAccountDetails(loginResponse.auth_login.access_token);
                            const accessToken = loginResponse.auth_login.access_token;
                            const userId = userDetails.users_me.id;
                            const userName = userDetails.users_me.username;
                            authCtx.onLogin(accessToken, userId, userName);
                            setAlertMsgs([]); 
                            return;
                        } else {
                            const errMsg = 'Account created but login failed (no token). Please try logging in manually.';
                            setAlertMsgs([errMsg]);
                            return;
                        }
                    } catch (loginError) {
                        const errMsg = 'Account created but failed during login process. Please try logging in manually.';
                        setAlertMsgs([errMsg]);
                        return;
                    }
                }
            })
            .catch(error => {
                console.error('Account creation/login network/unexpected catch:', error);
                if (error.message.includes('Value for field \"email\" in collection \"directus_users\" has to be unique.')) {
                    const errMsg = 'You are already registered with this email address.';
                    setEmailError(errMsg); 
                    setAlertMsgs([errMsg]);
                } else {
                    const errMsg = 'An unexpected error occurred.'; 
                    setAlertMsgs([errMsg]);
                }
            })
        }
    }
    return (
        <div className="container landing-page-container">
            <Paper elevation={0} square={true} className="landing-page-wrapper">
                <div className="start">
                    <h1>Boost Your Language Learning <span>with LangPulse Flashcards</span></h1>
                    <p>Our platform enables you to craft custom flashcards, word banks, and quizzes, serving as the ideal addition to your current language learning resources.</p>
                    <div className="cta">
                        <span>Give it a try:</span> <Button variant="contained" onClick={() => dispatch({type: 'deck/setDemoDrawer', value: true})}>Load demo Deck</Button>
                    </div>
                </div>
                <Card className="end">
                    <h3>Join LangPulse Today</h3>
                    <p>Create decks, save favorites, and manage it all from your dashboard.</p>
                    <form>
                        <TextField
                            autoComplete="fname"
                            name="firstName"
                            variant="outlined"
                            required
                            id="firstName"
                            className="input"
                            fullWidth
                            label="First Name"
                            autoFocus
                            value={firstName}
                            onChange={handleChange}
                            error={firstNameError !== ''} // Use specific error state
                            helperText={firstNameError} // Show specific error message
                            data-testid="register-first-name-input"
                        />
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            className="input"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                            value={lastName}
                            onChange={handleChange}
                            error={lastNameError !== ''} // Use specific error state
                            helperText={lastNameError} // Show specific error message
                            data-testid="register-last-name-input"
                        />
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            className="input"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={userEmail}
                            onChange={handleChange}
                            error={emailError !== ''} // Use specific error state
                            helperText={emailError} // Show specific error message
                            data-testid="register-email-input"
                        />
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            className="input"
                            autoComplete="current-password"
                            value={userPassword}
                            onChange={handleChange}
                            error={passwordError !== ''} // Use specific error state
                            helperText={passwordError} // Show specific error message
                            data-testid="register-password-input"
                        />
                    </form>
                    {/* Only show top alert for API/general errors */}
                    {(alertMsgs.length > 0 &&
                        <Alert severity="warning" className={classes.alert} data-testid="register-alert">
                            {alertMsgs.length > 1 ? (
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {alertMsgs.map((msg, idx) => <li key={idx}>{msg}</li>)}
                                </ul>
                            ) : (
                                alertMsgs[0]
                            )}
                        </Alert>
                    )}
                    <Button variant="contained" color="primary" fullWidth onClick={() => createAccount()} data-testid="register-submit-button">Create Account</Button>
                    <div>
                        <Link underline="hover" onClick={() => authCtx.onLoginOpen(true, false)} data-testid="login-link"><span className="acctTxt">Already have an account?</span> <span className="signIn">LOGIN</span></Link>
                    </div>
                </Card>
            </Paper>
            <DemoDecksDrawer 
                open={props.open}
                onClose={props.onClose}
            />
        </div>
    )
}
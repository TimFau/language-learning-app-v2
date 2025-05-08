import React, { useContext } from 'react';
// import { useDispatch } from 'react-redux'; // Removed
import AuthContext from 'context/auth-context';
import userService from 'services/userService';

// import DemoDecksDrawer from '../Deck/components/DemoDecksDrawer'; // Old import
import DemoDecksMenu from '../Deck/components/DemoDecksMenu'; // New import
// import heroImage from '../../../public/images/langpulse-hero-image.png'; // Assuming the image is placed here

import { TextField, Button, Link } from '@mui/material/'; // Removed Paper, Card
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

// type LoggedOutProps = {
//     open: boolean, // This open was for the DemoDecksDrawer, likely no longer needed at this level
//     onClose: (event: React.UIEvent<HTMLElement>) => void, // Same for onClose
// }
// Removing open and onClose from LoggedOutProps as DemoDecksMenu manages its own visibility via anchorEl
// If these props were for something else, this change might need review.
// For now, assuming they were solely for the drawer.

// interface LoggedOutProps {
    // Retain other props if any, or leave empty if open/onClose were the only ones.
    // For this refactor, assuming no other props are critical, or they are not used by DemoDecksMenu.
// }

export default function GuestPage(/* props: LoggedOutProps */) { // props might be empty now or have other unrelated props
    const classes = useStyles(); // Removed props from useStyles if it was only using open/onClose
    // const dispatch = useDispatch(); // Removed
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

    // State for the Demo Decks Menu anchor
    const [demoMenuAnchorEl, setDemoMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleDemoMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setDemoMenuAnchorEl(event.currentTarget);
    };

    const handleDemoMenuClose = () => {
        setDemoMenuAnchorEl(null);
    };

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
                        if (errorMsg.includes('Field "email" has to be unique.')) {
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
                if (error.message.includes('Value for field "email" in collection "directus_users" has to be unique.')) {
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
        <div className="landing-page-container"> 
            {/* Header Section */}
            <header className="landing-header">
                {/* Placeholder for Logo */}
                <div className="logo-container">
                    <img src={'/images/langpulse-logo.png'} alt="LangPulse Logo" />
                </div> 
                <Button 
                    variant="contained" 
                    onClick={handleDemoMenuOpen} // Changed from Redux dispatch
                    className="demo-button"
                    id="demo-decks-button" // For aria-labelledby in Menu
                >
                    Try a Demo Deck
                </Button>
            </header>

            {/* Hero Section */}
            <section className="landing-hero">
                <div className="hero-text">
                    <h1>Build your own language flashcards - instantly</h1>
                    <p>Turn any Google Sheet into a quiz-ready flashcard deck in seconds. Study when you want, how you want.</p>
                    <p>LangPulse is a fast, flexible flashcard web app built for learners who want total control over their vocab. No bloat. No barriers.</p>
                </div>
                <div className="hero-image">
                    <img src={'/images/langpulse-hero-image.png'} alt="Language learning illustration" />
                </div>
            </section>

            {/* Signup Section */}
            <section className="landing-signup">
                <h3>Join LangPulse Today</h3>
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
                <form>
                    <div className="form-row">
                        <TextField
                            autoComplete="fname"
                            name="firstName"
                            variant="outlined"
                            required
                            id="firstName"
                            className="input"
                            label="First Name"
                            autoFocus
                            value={firstName}
                            onChange={handleChange}
                            error={firstNameError !== ''}
                            helperText={firstNameError}
                            data-testid="register-first-name-input"
                        />
                        <TextField
                            variant="outlined"
                            required
                            id="lastName"
                            className="input"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                            value={lastName}
                            onChange={handleChange}
                            error={lastNameError !== ''}
                            helperText={lastNameError}
                            data-testid="register-last-name-input"
                        />
                    </div>
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
                        error={emailError !== ''}
                        helperText={emailError}
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
                        error={passwordError !== ''}
                        helperText={passwordError}
                        data-testid="register-password-input"
                    />
                    <div className="login-link-container">
                        <span className="acctTxt">Already have an account?</span> 
                        <Link underline="hover" onClick={() => authCtx.onLoginOpen(true, false)} data-testid="login-link" className="signIn">Login</Link>
                    </div>
                    <Button variant="contained" color="primary" fullWidth onClick={() => createAccount()} data-testid="register-submit-button" className="create-account-button">Create Account</Button>
                </form>
                
            </section>
            
            {/* <DemoDecksDrawer 
                open={props.open} // Old props
                onClose={props.onClose} // Old props
            /> */}
            <DemoDecksMenu 
                anchorEl={demoMenuAnchorEl}
                onClose={handleDemoMenuClose}
            />
        </div>
    )
}
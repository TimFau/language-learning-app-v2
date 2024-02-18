import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import AuthContext from 'context/auth-context';
import userService from 'services/userService';

import DemoDecksDrawer from '../../components/Deck/DemoDecksDrawer';

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
    const [alertMsg, setAlertMsg] = React.useState('');
    const [fieldWithError, setFieldWithError] = React.useState('');

    const authCtx = useContext(AuthContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.name) {
            case 'firstName':
                setFirstName(event.target.value);
                break;
            case 'lastName':
                setLastName(event.target.value);
                break;
            case 'email':
                setUserEmail(event.target.value);
                break;
            case 'password':
                setUserPassword(event.target.value);
                break;
            default:
                console.log('No match for event name')
        }
    }

    function validateFields () {
        if (firstName === '') {
            setFieldWithError('firstName')
            setAlertMsg('Please enter your first name.')
            return false
        } else if (lastName === '') {
            setFieldWithError('lastName')
            setAlertMsg('Please enter your last name.')
            return false
        } else if (userEmail === '') {
            setFieldWithError('email')
            setAlertMsg('Please enter your email address.')
            return false
        } else if (userPassword === '') {
            setFieldWithError('password')
            setAlertMsg('Please enter a password.')
            return false
        } else if (!CheckIsEmail(userEmail)) {
            setFieldWithError('email')
            setAlertMsg('Please enter a valid email address.')
            return false
        }
        setFieldWithError('')
        setAlertMsg('')
        return true
    }

    function createAccount() {
        if (validateFields()) {
            createAccountPost()
        }
        function createAccountPost() {
            userService.createAccount(firstName, lastName, userEmail, userPassword)
            .then(async response => {
                const data = await response
                if (data.errors) {
                    console.log('error present', data.errors)
                    const errorMsgs = data.errors;
                    for (let i = 0; i < errorMsgs.length; i++) {
                        let errorMsg = errorMsgs[i].message
                        console.log(errorMsg)
                        if (errorMsg.includes('Field "email" has to be unique.')) {
                            setAlertMsg('You are already registered with this email address.')
                        } else if (errorMsg.includes('This value is not a valid email address.')) {
                            setAlertMsg('Please enter a valid email address.')
                            setFieldWithError('email')
                        } else {
                            setAlertMsg(errorMsg)
                            setFieldWithError('')
                        }
                    }
                    return false
                } else {
                    authCtx.onLoginOpen(true, true);
                    setAlertMsg('');
                    return true
                }
            })
            .catch(error => {
                console.error('catch', error);
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
                            error={fieldWithError === 'firstName'}
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
                            error={fieldWithError === 'lastName'}
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
                            error={fieldWithError === 'email'}
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
                            error={fieldWithError === 'password'}
                        />
                    </form>
                    {alertMsg !== '' &&
                        <Alert severity="warning" className={classes.alert}>{alertMsg}</Alert>
                    }
                    <Button variant="contained" color="primary" fullWidth onClick={() => createAccount()}>Create Account</Button>
                    <div>
                        <Link underline="hover" onClick={() => authCtx.onLoginOpen(true, false)}><span className="acctTxt">Already have an account?</span> <span className="signIn">LOGIN</span></Link>
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
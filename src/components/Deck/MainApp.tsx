import { useState, useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import AuthContext from 'context/auth-context';

import Nav from '../Nav';
import Deck from '../../pages/Deck';
import LoggedOut from '../LoggedOut'
import LoggedIn from '../LoggedIn';
import DemoDecksDrawer from './DeckSelector/DemoDecksDrawer';
import Login from '../LoggedOut/Login';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material/';

function TranslationApp (props: PropsFromRedux) {
    const authCtx = useContext(AuthContext);

    // State Functions
    const [logOutDialogOpen, setLogOutDialogOpen] = useState<boolean>(false);

    // Temporarily hard code inputMode during refactor
    const inputMode = 'flashcard';

    function logout(endDeck = false) {
        if (props.deckStarted && !endDeck) {
            setLogOutDialogOpen(true)
        } else {
            props.setDeckStartedFalse();
            authCtx.onLogout();
            setLogOutDialogOpen(false);
        }
    };
  
    return (
    <>
        <Nav logout={() => logout(false)} />
        <div className={"container main-container " + inputMode}>
            <Routes>
                <Route path="/" element={
                    <>
                        {((!props.deckStarted) && (authCtx.userToken === '')) &&
                            <>
                                <LoggedOut />
                                <DemoDecksDrawer 
                                    open={props.demoDrawerOpen}
                                    onClose={props.setDemoDrawerClosed}
                                />
                            </>
                        }
                        {(!props.deckStarted && authCtx.userToken) &&
                            <LoggedIn />
                        }
                    </>
                } />
                <Route path="/deck" element={
                    <>
                        <Deck
                            deckDialogOpen={props.deckDialogOpen}
                            setDeckDialogOpen={props.setDeckDialogOpen}
                            setDeckDialogClose={props.setDeckDialogClose}
                            setDeckStartedFalse={props.setDeckStartedFalse}
                            setDeckStartedTrue={props.setDeckStartedTrue}
                        />
                        <Dialog
                            open={logOutDialogOpen}
                            onClose={() => setLogOutDialogOpen(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                            {"Logout and close deck?"}
                            </DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Logging out now will close the current deck without saving your progress. Would you like to continue?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={() => setLogOutDialogOpen(false)}>No</Button>
                            <Button onClick={() => logout(true)} autoFocus>
                                Yes
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                }
                />
            </Routes>
        </div>
        <Login />
    </>
    )
}

interface mapStateToPropsProps {
    deckStarted: boolean,
    deckDialogOpen: boolean,
    demoDrawerOpen: boolean,
}

const mapStateToProps = (state: mapStateToPropsProps) => ({
    deckStarted: state.deckStarted,
    deckDialogOpen: state.deckDialogOpen,
    demoDrawerOpen: state.demoDrawerOpen,
})

const mapDispatchToProps = {
    setDeckDialogOpen: () => ({type: 'deck/setDialog', value: true}),
    setDeckDialogClose: () => ({type: 'deck/setDialog', value: false}),
    setDeckStartedTrue: () => ({type: 'deck/setDeckStarted', value: true}),
    setDeckStartedFalse: () => ({type: 'deck/setDeckStarted', value: false}),
    setDemoDrawerOpen: () => ({type: 'deck/setDemoDrawer', value: true}),
    setDemoDrawerClosed: () => ({type: 'deck/setDemoDrawer', value: false}),
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(TranslationApp);
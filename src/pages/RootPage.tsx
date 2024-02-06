import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import AuthContext from 'context/auth-context';
import connector, { PropsFromRedux } from "../containers/RootPage.connector"

import Nav from '../components/Nav';
import DeckPage from './DeckPage';
import LoggedOut from '../components/LoggedOut'
import LoggedIn from '../components/LoggedIn';
import Login from '../components/LoggedOut/Login';

function RootPage (props: PropsFromRedux) {
    const authCtx = useContext(AuthContext);
  
    return (
    <>
        <Nav logout={() => authCtx.onLogout()} />
        <Routes>
            <Route path="/" element={
                <>
                {authCtx.userToken === '' &&
                    <LoggedOut 
                        open={props.demoDrawerOpen}
                        onClose={props.setDemoDrawerClosed}
                    />
                }
                {authCtx.userToken !== '' &&
                    <LoggedIn />
                }
                </>
            } />
            <Route path="/deck" element={
                <DeckPage
                    deckDialogOpen={props.deckDialogOpen}
                    setDeckDialogOpen={props.setDeckDialogOpen}
                    setDeckDialogClose={props.setDeckDialogClose}
                    deckStarted={props.deckStarted}
                    setDeckStartedTrue={props.setDeckStartedTrue}
                    setDeckStartedFalse={props.setDeckStartedFalse}
                />
            }
            />
        </Routes>
        <Login />
    </>
    )
}

export default connector(RootPage);
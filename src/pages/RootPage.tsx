import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import AuthContext from 'context/auth-context';
import connector, { PropsFromRedux } from "../containers/RootPage.connector"

import Nav from '../components/Nav';
import IndexPage from './IndexPage';
import DeckPage from './DeckPage';
import Login from '../components/LoggedOut/Login';

function RootPage (props: PropsFromRedux) {
    const authCtx = useContext(AuthContext);
  
    return (
    <>
        <Nav logout={() => authCtx.onLogout()} />
        <Routes>
            <Route path="/" element={
                <IndexPage 
                    authCtx={authCtx}
                    demoDrawerOpen={props.demoDrawerOpen}
                    setDemoDrawerClosed={props.setDemoDrawerClosed}
                />
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
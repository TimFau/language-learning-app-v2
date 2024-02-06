import { useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import AuthContext from 'context/auth-context';

import Nav from '../Nav';
import Deck from '../../pages/Deck';
import LoggedOut from '../LoggedOut'
import LoggedIn from '../LoggedIn';
import Login from '../LoggedOut/Login';

function TranslationApp (props: PropsFromRedux) {
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
                <Deck
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
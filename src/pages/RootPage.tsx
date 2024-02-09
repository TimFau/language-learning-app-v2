import { Route, Routes } from 'react-router-dom';

import connector, { PropsFromRedux } from "../containers/RootPage.connector"

import Nav from '../components/Nav';
import IndexPage from './IndexPage';
import DeckPage from './DeckPage';
import CommunityDecks from './CommunityDecksPage';
import Login from '../components/LoggedOut/Login';

function RootPage (props: PropsFromRedux) {
  
    return (
    <>
        <Nav />
        <Routes>
            <Route path="/" element={
                <IndexPage 
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
            <Route path="/decks" element={
                <CommunityDecks />
            }
            />
        </Routes>
        <Login />
    </>
    )
}

export default connector(RootPage);
import { Route, Routes } from 'react-router-dom';

import connector, { PropsFromRedux } from "../containers/Main.connector"

import Header from '../components/Header';
import IndexPage from '../pages/Index/Index';
import DeckPage from '../pages/Deck/Index';
import CommunityDecks from '../pages/CommunityDecks';
import Login from '../components/Unauthenticated/Login';

function RootPage (props: PropsFromRedux) {
  
    return (
    <>
        <Header />
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
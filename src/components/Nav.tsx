import { useContext, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import AddDeckModal from './Authenticated/AddDeckModal';
import getUsersDecks from './Authenticated/getUsersDecks';
import { Home as HomeIcon, CollectionsBookmark as CollectionsBookmarkIcon, LocalLibrary as LocalLibraryIcon, Logout as LogoutIcon, Login as LoginIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@mui/icons-material';

export default function Nav() {
    const [addListDialogOpen, setAddListDialogOpen] = useState(false);
    const dispatch = useAppDispatch();
    const deckStarted = useAppSelector((state) => state.deckStarted);
    const authCtx = useContext(AuthContext);
    let pathName = useLocation().pathname;
    const navigate = useNavigate();

    function goToDeckSelector() {
        dispatch({type: 'deck/setDeckStarted', value: false});
        dispatch({type: 'deck/setDialog', value: false});
        navigate('/')
    }

    const isLoggedIn = () => authCtx.userToken !== ''

    return (
        <>
        <header className="app-bar max-width-wrapper">
            <div className="app-bar-inner">
                <div className="start">
                    {!deckStarted ?
                    <Link to="/" className={['nav-item', pathName === '/' ? 'active' : ''].join(' ')}><button>{isLoggedIn() ? 
                        <><CollectionsBookmarkIcon/> My Decks</> :
                        <><HomeIcon /> Home</>}</button></Link>
                    :
                    <button className="nav-item" onClick={() => goToDeckSelector()}
                    ><ExitToAppIcon /> Exit Deck</button>
                    }
                    <Link to="/decks" className={['nav-item', pathName === '/decks' ? 'active' : ''].join(' ')}><button><LocalLibraryIcon /> Community Decks</button></Link>
                </div>
                <div className="end">
                    {!isLoggedIn() &&
                        <button
                            onClick={() => authCtx.onLoginOpen(true, false)}
                            className="nav-item login"
                        ><LoginIcon /> Login</button>
                    }
                    {isLoggedIn() && pathName !== "/deck" &&
                    <>
                        <button onClick={() => setAddListDialogOpen(true)} className="nav-item"><AddIcon /> Add Deck</button>
                        <button
                            onClick={authCtx.onLogout}
                            color="secondary"
                            className="nav-item logout"
                        ><LogoutIcon /> Logout</button>
                    </>
                    }
                </div>
            </div>
        </header>
        <AddDeckModal userId={authCtx.userId} addListDialogOpen={addListDialogOpen} closeDialog={() => setAddListDialogOpen(false)} refreshLists={() => getUsersDecks(authCtx.userToken, authCtx.userId)} />
        </>
    )
}
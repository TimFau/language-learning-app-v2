import { useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import { Home as HomeIcon, CollectionsBookmark as CollectionsBookmarkIcon, LocalLibrary as LocalLibraryIcon, Logout as LogoutIcon, Login as LoginIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';

export default function Nav() {
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
        <header className="app-bar max-width-wrapper">
            <div className="app-bar-inner">
                <div className="start">
                    {!deckStarted ?
                    <Link to="/" className={pathName === '/' ? 'active' : ''}><button>{isLoggedIn() ? 
                        <><CollectionsBookmarkIcon/> My Decks</> :
                        <><HomeIcon /> Home</>}</button></Link>
                    :
                    <button onClick={() => goToDeckSelector()}
                    ><ExitToAppIcon /> Exit Deck</button>
                    }
                    <Link to="/decks" className={pathName === '/decks' ? 'active' : ''}><button><LocalLibraryIcon /> Community Decks</button></Link>
                </div>
                <div className="end">
                    {!isLoggedIn() &&
                    <button
                        onClick={() => authCtx.onLoginOpen(true, false)}
                        className="login"
                    ><LoginIcon /> Login</button>
                    }
                    {isLoggedIn() && pathName !== "/deck" &&
                    <button
                        onClick={authCtx.onLogout}
                        color="secondary"
                        className="login"
                    ><LogoutIcon /> Logout</button>
                    }
                </div>
            </div>
        </header>
    )
}
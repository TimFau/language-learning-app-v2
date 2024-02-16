import { useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';

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
                    <Link to="/" className={pathName === '/' ? 'active' : ''}><button>{isLoggedIn() ? 'My Decks' : 'Home'}</button></Link>
                    :
                    <button onClick={() => goToDeckSelector()}
                    >Exit Deck</button>
                    }
                    <Link to="/decks" className={pathName === '/decks' ? 'active' : ''}><button>Community Decks</button></Link>
                </div>
                <div className="end">
                    {!isLoggedIn() &&
                    <button
                        onClick={() => authCtx.onLoginOpen(true, false)}
                        className="login"
                    >Login</button>
                    }
                    {isLoggedIn() && pathName !== "/deck" &&
                    <button
                        onClick={authCtx.onLogout}
                        color="secondary"
                        className="login"
                    >Logout</button>
                    }
                </div>
            </div>
        </header>
    )
}
import { useContext } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import DeckManagementModal from './Authenticated/DeckManagementModal';
import { CollectionsBookmark as CollectionsBookmarkIcon, LocalLibrary as LocalLibraryIcon, Logout as LogoutIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@mui/icons-material';

export default function Nav() {
    const dispatch = useAppDispatch();
    const deckStarted = useAppSelector((state) => state.deckStarted);
    const authCtx = useContext(AuthContext);
    const modalCtx = useContext(ModalContext);

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
        {isLoggedIn() &&
        <header className="app-bar max-width-wrapper">
            <div className="app-bar-inner">
                <div className="start">
                    {!deckStarted ?
                    <>
                    <Link to="/" className={['nav-item', pathName === '/' ? 'active' : ''].join(' ')}>
                        <button className="nav-item-wrapper">
                            <CollectionsBookmarkIcon/> <span className="nav-label">My Decks</span>
                        </button>
                    </Link>
                    <Link to="/decks" className={['nav-item', pathName === '/decks' ? 'active' : ''].join(' ')}>
                        <button className="nav-item-wrapper">
                            <LocalLibraryIcon /> <span className="nav-label">Community Decks</span>
                        </button>
                    </Link>
                    </>
                    :
                    <button className="nav-item" onClick={() => goToDeckSelector()}>
                        <ExitToAppIcon /> <span className="nav-label">Exit Deck</span>
                    </button>
                    }
                </div>
                <div className="end">
                    {!deckStarted && pathName !== "/deck" &&
                    <>
                        <button onClick={() => modalCtx.openModal()} className="nav-item"><span className="nav-item-wrapper"><AddIcon /> <span className="nav-label">Add Deck</span></span></button>
                        <button
                            onClick={authCtx.onLogout}
                            color="secondary"
                            className="nav-item logout"
                        ><span className="nav-item-wrapper"><LogoutIcon /> <span className="nav-label">Logout</span></span></button>
                    </>
                    }
                </div>
            </div>
        </header>
        }
        <DeckManagementModal userId={authCtx.userId} addListDialogOpen={modalCtx.isModalOpen} closeDialog={() => modalCtx.closeModal()} />
        </>
    )
}
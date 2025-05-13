import { useContext, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import DeckManagementModal from './Authenticated/DeckManagementModal';
import { CollectionsBookmark as CollectionsBookmarkIcon, LocalLibrary as LocalLibraryIcon, Logout as LogoutIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@mui/icons-material';
import ExitDeckConfirmDialog from './ExitDeckConfirmDialog';

export default function Nav() {
    const dispatch = useAppDispatch();
    const deckStarted = useAppSelector((state) => state.deckStarted);
    const authCtx = useContext(AuthContext);
    const modalCtx = useContext(ModalContext);

    let pathName = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();

    const [exitDialogOpen, setExitDialogOpen] = useState(false);

    function goToDeckSelector() {
        dispatch({type: 'deck/setDeckStarted', value: false});
        dispatch({type: 'deck/setDialog', value: false});
        if (location.state?.from === '/decks') {
            navigate('/decks');
        } else {
            navigate('/');
        }
    }

    const isLoggedIn = () => authCtx.userToken !== ''

    function handleLogout() {
        authCtx.onLogout();
        navigate('/');
    }

    return (
        <>
        {(isLoggedIn() || pathName === '/deck') &&
        <header className="app-bar max-width-wrapper">
            <div className="app-bar-inner">
                <Link to="/" className="logo-link">
                    <img src={`${import.meta.env.BASE_URL}images/langpulse-logo.png`} alt="LangPulse Logo" className="nav-logo" />
                </Link>
                <div className="start">
                    {/* Items moved to .end div */}
                </div>
                <div className="end">
                    {deckStarted ? (
                        <button className="nav-item" onClick={() => setExitDialogOpen(true)}>
                            <ExitToAppIcon /> <span className="nav-label">Exit Deck</span>
                        </button>
                    ) : (
                        <>
                            {isLoggedIn() &&
                                <>
                                <Link to="/" className={['nav-item', pathName === '/' ? 'active' : ''].join(' ')}>
                                    <button className="nav-item-wrapper">
                                        <CollectionsBookmarkIcon /> <span className="nav-label">My Decks</span>
                                    </button>
                                </Link>
                                <Link to="/decks" className={['nav-item', pathName === '/decks' ? 'active' : ''].join(' ')}>
                                    <button className="nav-item-wrapper">
                                        <LocalLibraryIcon /> <span className="nav-label">Community Decks</span>
                                    </button>
                                </Link></>
                            }
                            {pathName !== "/deck" && (
                                <>
                                    <button 
                                        onClick={() => modalCtx.openModal()} 
                                        className="nav-item"
                                        data-testid="create-deck-button"
                                    >
                                        <span className="nav-item-wrapper">
                                            <AddIcon /> <span className="nav-label">Add Deck</span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        color="secondary"
                                        className="nav-item logout"
                                        data-testid="logout-button"
                                    >
                                        <span className="nav-item-wrapper">
                                            <LogoutIcon /> <span className="nav-label">Logout</span>
                                        </span>
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
        }
        <ExitDeckConfirmDialog
            open={exitDialogOpen}
            onClose={() => setExitDialogOpen(false)}
            onConfirm={() => { setExitDialogOpen(false); goToDeckSelector(); }}
        />
        <DeckManagementModal userId={authCtx.userId} addListDialogOpen={modalCtx.isModalOpen} closeDialog={() => modalCtx.closeModal()} />
        </>
    )
}
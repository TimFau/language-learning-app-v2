import { useContext, useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import DeckManagementModal from './Authenticated/DeckManagementModal';
import { CollectionsBookmark as CollectionsBookmarkIcon, LocalLibrary as LocalLibraryIcon, Logout as LogoutIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@mui/icons-material';
import ExitDeckConfirmDialog from './ExitDeckConfirmDialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

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
        <AppBar position="sticky" color="default" elevation={1} sx={{ zIndex: 1000, borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.main' }} className="app-bar">
            <Toolbar disableGutters sx={{ minHeight: 'unset', paddingY: '20px', paddingX: 0 }}>
                <div className="app-bar-inner max-width-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="logo-link">
                        <img src={`${import.meta.env.BASE_URL}images/langpulse-logo.png`} alt="LangPulse Logo" className="nav-logo" />
                    </Link>
                    <div className="start">
                        {/* Items moved to .end div */}
                    </div>
                    <div className="end">
                        {deckStarted ? (
                            <Button className="nav-item" onClick={() => setExitDialogOpen(true)} startIcon={<ExitToAppIcon />}>
                                <span className="nav-label">Exit Deck</span>
                            </Button>
                        ) : (
                            <>
                                {isLoggedIn() &&
                                    <>
                                    <Link to="/" className={['nav-item', pathName === '/' ? 'active' : ''].join(' ')}>
                                        <Button className="nav-item-wrapper" startIcon={<CollectionsBookmarkIcon />}>
                                            <span className="nav-label">My Decks</span>
                                        </Button>
                                    </Link>
                                    <Link to="/decks" className={['nav-item', pathName === '/decks' ? 'active' : ''].join(' ')}>
                                        <Button className="nav-item-wrapper" startIcon={<LocalLibraryIcon />}>
                                            <span className="nav-label">Community Decks</span>
                                        </Button>
                                    </Link></>
                                }
                                {pathName !== "/deck" && (
                                    <>
                                        <Button 
                                            onClick={() => modalCtx.openModal()} 
                                            className="nav-item"
                                            data-testid="create-deck-button"
                                            startIcon={<AddIcon />}
                                        >
                                            <span className="nav-label">Add Deck</span>
                                        </Button>
                                        <Button
                                            onClick={handleLogout}
                                            color="secondary"
                                            className="nav-item logout"
                                            data-testid="logout-button"
                                            startIcon={<LogoutIcon />}
                                        >
                                            <span className="nav-label">Logout</span>
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Toolbar>
        </AppBar>
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
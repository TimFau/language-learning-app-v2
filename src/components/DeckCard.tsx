import FavoriteIcon from '@mui/icons-material/Favorite';
import { Card, CardContent, Typography, CardActions, CardActionArea, IconButton, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Link, CircularProgress } from "@mui/material"
import { useNavigate } from "react-router";
import deckService from 'services/deckService';
import sheetService from 'services/sheetService';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import { useContext, useState } from "react";
import { FavoriteBorder, Language, Delete as DeleteIcon, Edit as EditIcon, ArrowForwardIos, SaveAlt } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { SAVE_MULTIPLE_TERMS } from '../queries';
import { getLanguageCode } from '../utils/languageUtils';
import { SavedTermMetadata, SavedTermInput, createSavedTermInput } from '../types/SavedTerm';

interface DeckTerm {
    Language1: string;
    Language2: string;
    [key: string]: any;
}

type DeckCardProps = {
    item: any,
    from?: string
}

const DeckCard = (props: DeckCardProps) => {
    const deck = props.item.deck_relation ? props.item.deck_relation : props.item
    const { deck_name: deckName, deck_id: deckId } = deck
    const authCtx = useContext(AuthContext);
    const modalCtx = useContext(ModalContext);
    const userToken = authCtx.userToken || ''
    const savedDeckId = props.item.deck_relation ? props.item.id : null

    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isSavingTerms, setIsSavingTerms] = useState(false);
    const [saveProgress, setSaveProgress] = useState(0);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    const [saveMultipleTerms] = useMutation(SAVE_MULTIPLE_TERMS, {
        context: {
            headers: {
                authorization: `Bearer ${authCtx.userToken}`
            }
        }
    });

    const handleClick = () => {
        if (savedDeckId) {
            const now = new Date().toISOString();
            deckService.updateSavedDeck(userToken, savedDeckId, now)
        }
        const from = props.from || '/';
        navigate(`/deck?name=${deckName}&id=${deckId}`, { state: { from } });
    }

    const handleEditDeck = () => {
        console.log('handleEditDeck', deck)
        modalCtx.setDeck({
            isPublic: deck.status === 'published',
            ...deck
        })
        modalCtx.setModeEdit()
        modalCtx.openModal()
    }

    const handleDeleteClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        deckService.deleteDeck(userToken, deck.id, authCtx.userId);
        setConfirmOpen(false);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const handleSaveAllTerms = async () => {
        if (!authCtx.userToken) {
            authCtx.onLoginOpen(true, false);
            return;
        }

        setShowSaveConfirm(true);
    };

    const handleConfirmSaveAll = async () => {
        setIsSavingTerms(true);
        setSaveProgress(0);
        setSaveError(null);

        try {
            // Fetch terms from Google Sheet
            const data = await sheetService.getSheet(deckId);
            if (!data || data.error || data.length === 0) {
                throw new Error(data.error || 'Failed to load deck terms');
            }

            // Filter and prepare terms for saving
            const terms = data
                .filter((item: DeckTerm) => item.Language1 && item.Language2)
                .map((item: DeckTerm, index: number): SavedTermInput => 
                    createSavedTermInput(
                        item.Language1,
                        item.Language2,
                        getLanguageCode(deck.Language1),
                        authCtx.userId,
                        {
                            source_deck_id: deckId,
                            source_term_key: `${index + 1}`, // Using row number as a stable key
                            source_definition: item.Language2,
                            sync_preference: 'manual', // Default to manual sync
                            last_synced_at: new Date()
                        },
                        'published'
                    )
                );

            if (terms.length === 0) {
                throw new Error('No valid terms found in deck');
            }

            setSaveProgress(50); // Show progress that we've prepared the terms

            // Save all terms in one operation
            await saveMultipleTerms({
                variables: {
                    items: terms
                }
            });

            setSaveProgress(100);
            
            // Show success for 2 seconds before closing
            await new Promise(resolve => setTimeout(resolve, 2000));
            setShowSaveConfirm(false);
        } catch (err: any) {
            setSaveError(err.message || 'Failed to save terms');
            setSaveProgress(0);
            // Don't close dialog on error - user needs to see the error message
        } finally {
            setIsSavingTerms(false);
        }
    };

    return (
        <>
            <Card 
                className={[
                    "deck-card", 
                    props.item.type === 'user' ? 'isUser' : 'notUser',
                    props.item.isOwnDeck ? 'is-own-deck' : ''
                ].join(' ')}
                data-testid={`deck-card-${deckName.replace(/\s+/g, '-')}-${deck.id}`}
            >
                <CardActionArea onClick={() => handleClick()} data-testid={`deck-card-action-area`} className="deck-card__action-area-top">
                    <CardContent className="deck-card__action-area-top__content">
                        <div className="card-content-top">
                            <div className="deck-info">
                                <Language />
                                <Typography variant="subtitle2" component="span">{deck.Language2}</Typography>
                            </div>
                            <span className="deck-categories">
                                {props.item.isOwnDeck && <Chip label="My Deck" size="small" className="my-deck-chip" color="primary" />}
                                {deck.categories?.map((category: string) => <Chip label={category} key={category} size="small" />)}
                            </span>
                        </div>
                        <Typography gutterBottom variant="h5" component="h3" className="deck-name">
                            {deckName}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing className="deck-card__action-area-bottom">
                    {props.item.type !== 'user' ?
                    <>
                        {authCtx.userToken && (
                            <>
                                {props.item.isOwnDeck ? (
                                    <IconButton
                                        aria-label={`Edit "${deckName}"`}
                                        onClick={(e) => { e.stopPropagation(); handleEditDeck() }}
                                        size="large">
                                        <EditIcon />
                                    </IconButton>
                                ) : (
                                    <>
                                        <IconButton
                                            aria-label={props.item.isSaved ? "Remove from favorites" : "Add to favorites"}
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if (authCtx.userToken) {
                                                    props.item.isSaved ? deckService.unsaveDeck(userToken, props.item.savedDeckId, authCtx.userId) : deckService.saveDeck(userToken, deck, authCtx.userId)
                                                } else {
                                                    console.log("User must be logged in to save decks");
                                                }
                                            }}
                                            size="large">
                                            {props.item.isSaved ? <FavoriteIcon /> : <FavoriteBorder />}
                                        </IconButton>
                                        <IconButton
                                            aria-label="Save all terms to word bank"
                                            onClick={(e) => { e.stopPropagation(); handleSaveAllTerms(); }}
                                            size="large"
                                            disabled={isSavingTerms}
                                        >
                                            {isSavingTerms ? (
                                                <CircularProgress size={24} variant="determinate" value={saveProgress} />
                                            ) : (
                                                <SaveAlt />
                                            )}
                                        </IconButton>
                                    </>
                                )}
                            </>
                        )}
                    </>
                    :
                    <>
                        <IconButton
                            aria-label={`Delete "${deckName}"`}
                            onClick={handleDeleteClick}
                            size="large">
                            <DeleteIcon />
                        </IconButton>
                        <IconButton
                            aria-label={`Edit "${deckName}"`}
                            onClick={(e) => { e.stopPropagation(); handleEditDeck() }}
                            size="large">
                            <EditIcon />
                        </IconButton>
                    </>
                    }
                    <Link href="#" onClick={(e) => {e.preventDefault(); handleClick();}} className="try-now-link" data-testid="try-now-link">
                        {authCtx.userToken ? 'Study Now' : 'Try Now'} <ArrowForwardIos />
                    </Link>
                </CardActions>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={confirmOpen}
                onClose={handleCloseConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                data-testid="delete-confirm-dialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Delete Deck "${deckName}"?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this deck? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} data-testid="cancel-delete-button">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus data-testid="confirm-delete-button">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Save All Terms Confirmation Dialog */}
            <Dialog
                open={showSaveConfirm}
                onClose={() => setShowSaveConfirm(false)}
                aria-labelledby="save-all-dialog-title"
                aria-describedby="save-all-dialog-description"
            >
                <DialogTitle id="save-all-dialog-title">
                    Save All Terms to Word Bank?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="save-all-dialog-description">
                        This will save all terms from "{deckName}" to your personal word bank.
                        {saveError && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                Error: {saveError}
                            </Typography>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSaveConfirm(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSaveAll} color="primary" autoFocus>
                        Save All Terms
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeckCard
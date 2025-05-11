import React from 'react';

import { 
    Button, ButtonGroup, 
    Typography, DialogTitle, DialogContent, Dialog, useMediaQuery, IconButton, Skeleton
} from '@mui/material/';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch } from 'hooks';
import { useNavigate } from 'react-router-dom';

interface deckDialogProps {
    language1: string | undefined,
    language2: string | undefined,
    translateMode: string,
    inputMode: string,
    currentDeckName: string,
    deckDataLoaded: boolean,
    deckDialogOpen: boolean,
    children?: React.ReactNode,
    startDeck: () => void,
    setInputMode: (mode: string) => void,
    setDialogClosed: () => void,
    setTranslationMode1: () => void,
    setTranslationMode2: () => void,
    from?: string
}

export default function DeckDialog(props: deckDialogProps) {
    const isBelow400px = useMediaQuery('(max-width:399.95px)');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Temporary skeleton loading state for demo
    const [showSkeleton, setShowSkeleton] = React.useState(true);
    React.useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Handler for the close (exit deck) button
    function handleExitDeck() {
        dispatch({type: 'deck/setDeckStarted', value: false});
        dispatch({type: 'deck/setDialog', value: false});
        if (props.from === '/decks') {
            navigate('/decks');
        } else {
            navigate('/');
        }
    }

    return (
        <Dialog 
            open={props.deckDialogOpen} 
            className="deck-options" 
            id="deckDialog"
            disableEscapeKeyDown
            // Prevent closing by clicking the backdrop
            // MUI Dialog uses 'onClose' with reason, so we need to block backdrop click
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                    props.setDialogClosed();
                }
            }}
        >
            <DialogTitle id="simple-dialog-title">
                Set Up Your Session
                <IconButton
                    aria-label="close"
                    onClick={handleExitDeck}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    data-testid="exit-deck-button"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers className="deck-options-content">
                <Typography gutterBottom className="deck-options-list-label">
                  Selected List: <strong data-testid="deck-name">
                    {(props.deckDataLoaded && !showSkeleton) ? props.currentDeckName : <Skeleton width={160} height={19} style={{ display: 'inline-block', verticalAlign: 'middle' }} />}
                  </strong>
                </Typography>
                <Typography className="deck-options-section-label">How do you want to study?</Typography>
                <ButtonGroup
                    color="primary"
                    variant="outlined"
                    fullWidth
                    className="deck-options-button-group"
                    orientation={isBelow400px ? 'vertical' : 'horizontal'}
                >
                    <Button
                        variant={props.inputMode === 'Flashcard' ? "contained" : 'outlined'}
                        onClick={() => props.setInputMode('Flashcard')}
                        className="deck-options-button"
                        disabled={!props.deckDataLoaded || showSkeleton}
                    >Flashcard</Button>
                    <Button
                        variant={props.inputMode === 'Wordbank' ? 'contained' : 'outlined'}
                        onClick={() => props.setInputMode('Wordbank')}
                        className="deck-options-button"
                        disabled={!props.deckDataLoaded || showSkeleton}
                    >Wordbank</Button>
                    <Button
                        variant={props.inputMode === 'Keyboard' ? 'contained' : 'outlined'}
                        onClick={() => props.setInputMode('Keyboard')}
                        className="deck-options-button"
                        disabled={!props.deckDataLoaded || showSkeleton}
                    >Keyboard</Button>
                </ButtonGroup>
                <Typography className="deck-options-section-label">Translate From:</Typography>
                <ButtonGroup
                    color="primary"
                    variant="outlined"
                    fullWidth
                    className="deck-options-button-group"
                    orientation="vertical"
                >
                    {(props.deckDataLoaded && !showSkeleton) ? (
                      <Button
                          variant={props.translateMode === '1to2' ? 'contained' : 'outlined'}
                          onClick={() => props.setTranslationMode1()}
                          className="deck-options-button"
                      >{props.language1} to {props.language2}</Button>
                    ) : (
                      <Skeleton variant="rectangular" height={36} width="100%" style={{ borderRadius: '6px 6px 0 0' }} />
                    )}
                    {(props.deckDataLoaded && !showSkeleton) ? (
                      <Button
                          variant={props.translateMode === '2to1' ? 'contained' : 'outlined'}
                          onClick={() => props.setTranslationMode2()}
                          className="deck-options-button"
                      >{props.language2} to {props.language1}</Button>
                    ) : (
                      <Skeleton variant="rectangular" height={36} width="100%" style={{ borderRadius: '0 0 6px 6px' }} />
                    )}
                </ButtonGroup>
            </DialogContent>
            {(props.deckDataLoaded && !showSkeleton) ? (
              <Button
                  onClick={() => props.startDeck()}
                  data-testid="start-deck-button"
                  variant="contained"
                  className="start-deck-final-button"
              >Start Deck</Button>
            ) : (
              <Skeleton variant="rectangular" height={44} width="100%" style={{ borderRadius: 6 }} />
            )}
        </Dialog>
    )
}
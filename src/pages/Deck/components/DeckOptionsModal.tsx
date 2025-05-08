import React from 'react';

import { 
    CircularProgress, Button, ButtonGroup, 
    Typography, DialogTitle, DialogContent, Dialog, useMediaQuery
} from '@mui/material/';

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
    setTranslationMode2: () => void
}

export default function DeckDialog(props: deckDialogProps) {
    const isBelow400px = useMediaQuery('(max-width:399.95px)');

    return (
        <Dialog open={props.deckDialogOpen} onClose={props.setDialogClosed} className="deck-options" id="deckDialog">
            <DialogTitle id="simple-dialog-title">Set Up Your Session</DialogTitle>
            {props.deckDataLoaded ?
            <React.Fragment>
            <DialogContent dividers className="deck-options-content">
                <Typography gutterBottom className="deck-options-list-label">Selected List: <strong data-testid="deck-name">{props.currentDeckName}</strong></Typography>
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
                    >Flashcard</Button>
                    <Button
                        variant={props.inputMode === 'Wordbank' ? 'contained' : 'outlined'}
                        onClick={() => props.setInputMode('Wordbank')}
                        className="deck-options-button"
                    >Wordbank</Button>
                    <Button
                        variant={props.inputMode === 'Keyboard' ? 'contained' : 'outlined'}
                        onClick={() => props.setInputMode('Keyboard')}
                        className="deck-options-button"
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
                    <Button
                        variant={props.translateMode === '1to2' ? 'contained' : 'outlined'}
                        onClick={() => props.setTranslationMode1()}
                        className="deck-options-button"
                    >{props.language1} to {props.language2}</Button>
                    <Button
                        variant={props.translateMode === '2to1' ? 'contained' : 'outlined'}
                        onClick={() => props.setTranslationMode2()}
                        className="deck-options-button"
                    >{props.language2} to {props.language1}</Button>
                </ButtonGroup>
            </DialogContent>
            <Button
                // On Click
                    // Send value to getDeckData in App.js
                onClick={() => props.startDeck()}
                data-testid="start-deck-button"
                variant="contained"
                className="start-deck-final-button"
            >Start Deck</Button>
            </React.Fragment>
            :
            <CircularProgress style={{margin: "100px 150px"}} />
            }
        </Dialog>
    )
}
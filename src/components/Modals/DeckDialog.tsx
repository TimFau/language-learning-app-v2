import React from 'react';

import { 
    CircularProgress, Button, ButtonGroup, 
    Typography, DialogTitle, DialogContent, Dialog }
from '@mui/material/';

export default function deckDialog(props) {

    return (
        <Dialog open={props.deckDialogOpen} onClose={props.setDialogClosed} className="deck-dialog" id="deckDialog">
            <DialogTitle id="simple-dialog-title">Deck Options</DialogTitle>
            {props.deckDataLoaded ?
            <React.Fragment>
            <DialogContent dividers>
                <Typography gutterBottom>Selected List: <strong>{props.currentListName}</strong></Typography>
                <Typography >Choose Mode</Typography>
                <ButtonGroup
                    color="primary"
                    variant="outlined"
                    fullWidth
                >
                    <Button
                        variant={props.inputMode === 'Flashcard' ? "contained" : 'outlined'}
                        onClick={() => props.setInputMode('Flashcard')}
                    >Flashcard</Button>
                    <Button
                        variant={props.inputMode === 'Wordbank' ? 'contained' : 'outlined'}
                        onClick={() => props.setInputMode('Wordbank')}
                    >Wordbank</Button>
                    <Button
                        variant={props.inputMode === 'Keyboard' ? 'contained' : 'outlined'}
                        onClick={() => props.setInputMode('Keyboard')}
                    >Keyboard</Button>
                </ButtonGroup>
                <Typography >Choose Order</Typography>
                <ButtonGroup
                    color="primary"
                    orientation="vertical"
                    variant="outlined"
                    fullWidth
                >
                    <Button
                        variant={props.translateMode === '1to2' ? 'contained' : 'outlined'}
                        onClick={() => props.setTranslationMode1()}
                    >{props.language1} to {props.language2}</Button>
                    <Button
                        variant={props.translateMode === '2to1' ? 'contained' : 'outlined'}
                        onClick={() => props.setTranslationMode2()}
                    >{props.language2} to {props.language1}</Button>
                </ButtonGroup>
            </DialogContent>
            <Button
                // On Click
                    // Send value to getDeckData in App.js
                onClick={() => props.startDeck(props.currentListId)}
            >Start Deck</Button>
            </React.Fragment>
            :
            <CircularProgress style={{margin: "100px 150px"}} />
            }
        </Dialog>
    )
}
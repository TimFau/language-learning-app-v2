/**
 * DeckManagementModal Component
 * 
 * This component is a modal used for managing (creating and editing) decks.
 * It uses the context 'ModalContext' to handle its state and functions.
 * 
 * The 'mode' state from the context determines whether the modal is being used to add a new deck or edit an existing one.
 * 
 * The 'existingDeck' state from the context represents the current deck being edited.
 * It is null when 'mode' is 'add', and it contains the deck data when 'mode' is 'edit'.
 * 
 */

import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, TextField } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import deckService from 'services/deckService';
import sheetService from 'services/sheetService';

interface DeckManagementModalProps {
    userId: string,
    addListDialogOpen: boolean,
    refreshLists: () => void,
    closeDialog: () => void,
}

const DeckManagementModal = (props: DeckManagementModalProps) => {

    const [deckName, setDeckName] = useState('')
    const [deckId, setDeckId] = useState('')
    const [makePublic, setMakePublic] = useState(true)
    const [id, setId] = useState('')
    const [deckErrorMsg, setDeckErrorMsg] = useState('')

    const authCtx = useContext(AuthContext);
    const modalCtx = useContext(ModalContext);
    const dialogOpen = props.addListDialogOpen;

    const isAdd = modalCtx.mode === 'add'
    const isEdit = modalCtx.mode === 'edit'

    useEffect(() => {
        const existingDeck = modalCtx.existingDeck
        if(existingDeck) {
            console.log('existingDeck', existingDeck)
            setDeckName(existingDeck.deck_name || '')
            setDeckId(existingDeck.deck_id || '')
            setMakePublic(existingDeck.isPublic || false)
            setId(existingDeck.id || '')
        }
    }, [modalCtx.existingDeck])

    function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.name === 'DeckName') {
            setDeckName(event.target.value)
        } else if (event.target.name === 'DeckID') {
            setDeckId(event.target.value)
        } else if (event.target.name === 'MakePublic') {
            setMakePublic(event.target.checked)
        }
    }

    function handleSubmit () {
        // Check if valid
        sheetService.checkSheetValidity(deckId)
        .then(response => {
            if (response.status === 200) {
                setDeckErrorMsg('')
                sendRequest()
            } else {
                setDeckErrorMsg('Unable to validate Sheet ID')
            }
        })
        .catch((error) => {
            console.error('Error', error)
        })

        const handleResult = (result: any) => {
            console.log('new deck result', result)
            props.refreshLists();
            handleClose()
        }


        // Add deck to user_decks or update existing item
        function sendRequest() {
            if(isAdd) {
                deckService.addDeck(deckName, deckId, makePublic, authCtx.userToken).then(
                    handleResult,
                    (error) => {
                        console.log(error);
                    }
                )
            } else if (isEdit) {
                deckService.updateDeck(deckName, deckId, makePublic, id, authCtx.userToken).then(
                    handleResult,
                    (error) => {
                        console.log(error);
                    }
                )
            
            }
        }
    }

    function handleClose() {
        props.closeDialog();
    }
    
    return (
        <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogTitle>
                {isAdd ? "Add New Deck" : "Edit Deck"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please choose a name for your deck and enter the Google spreadsheet ID below.
                </DialogContentText>
                <TextField
                    onChange={handleChange}
                    value={deckName}
                    autoFocus
                    id="addNewDeckName"
                    name="DeckName"
                    label="Deck Name"
                    type="text"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    onChange={handleChange}
                    value={deckId}
                    id="addNewDeckID"
                    name="DeckID"
                    label="Deck ID"
                    type="text"
                    fullWidth
                    margin="normal"
                    error={deckErrorMsg !== ''}
                    helperText={deckErrorMsg}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                        onChange={handleChange}
                        value={makePublic}
                        checked={makePublic}
                        name="MakePublic"
                        defaultChecked
                        />
                    } 
                    label="Share this deck with the community to contribute to our growing collection of resources. Uncheck this box if you prefer to keep this deck private."
                />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>{isAdd ? "Add Deck" : "Save Deck"}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeckManagementModal
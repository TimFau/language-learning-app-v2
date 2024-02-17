import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, TextField } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import deckService from 'services/deckService';
import sheetService from 'services/sheetService';

interface AddDeckModalProps {
    userId: string,
    addListDialogOpen: boolean,
    refreshLists: () => void,
    closeDialog: () => void,
}

const AddDeckModal = (props: AddDeckModalProps) => {

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

    function handleAddDeck () {
        // Check if valid
        sheetService.checkSheetValidity(deckId)
        .then(response => {
            if (response.status === 200) {
                setDeckErrorMsg('')
                sendPost()
            } else {
                setDeckErrorMsg('Unable to validate Sheet ID')
            }
        })
        .catch((error) => {
            console.error('Error', error)
        })
        // Add list to user_lists or update existing item
        function sendPost() {
            if(isAdd) {
                deckService.addDeck(deckName, deckId, makePublic, authCtx.userToken).then(
                    (result) => {
                        console.log('new list result inside', result)
                        props.refreshLists();
                        handleClose()
                    },
                    (error) => {
                        console.log(error);
                    }
                )
            } else if (isEdit) {
                deckService.updateDeck(deckName, deckId, makePublic, id, authCtx.userToken).then(
                    (result) => {
                        console.log('new list result inside', result)
                        props.refreshLists();
                        handleClose()
                    },
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
                <Button onClick={handleAddDeck}>{isAdd ? "Add Deck" : "Save Deck"}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddDeckModal
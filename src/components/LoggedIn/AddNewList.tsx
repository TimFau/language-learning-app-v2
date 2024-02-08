import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React, { useState, useContext } from 'react';
import AuthContext from 'context/auth-context';
import deckService from 'services/deckService';
import sheetService from 'services/sheetService';

interface AddNewListModalProps {
    userId: string,
    addListDialogOpen: boolean,
    refreshLists: () => void,
    closeDialog: () => void,
}

export default function AddNewListModal(props: AddNewListModalProps) {

    const [deckName, setDeckName] = useState('');
    const [deckId, setDeckId] = useState('');
    const [deckErrorMsg, setDeckErrorMsg] = useState('');

    const authCtx = useContext(AuthContext);
    const dialogOpen = props.addListDialogOpen;

    function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.name === 'DeckName') {
            setDeckName(event.target.value)
        } else if (event.target.name === 'DeckID') {
            setDeckId(event.target.value)
        }
    }

    function addNewList () {
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
        // Add list to user_lists
        function sendPost() {
            deckService.addPrivateList(deckName, deckId, authCtx.userToken).then(
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

    function handleClose() {
        props.closeDialog();
    }
    
    return (
        <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogTitle>
                Add New Deck
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please choose a name for your new deck and enter the Google spreadsheet ID below.
                </DialogContentText>
                <TextField
                    onChange={handleChange}
                    value={deckName}
                    autoFocus
                    id="addNewDeckListName"
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
            </DialogContent>
            <DialogActions>
                <Button onClick={addNewList}>Add Deck</Button>
            </DialogActions>
        </Dialog>
    )
}
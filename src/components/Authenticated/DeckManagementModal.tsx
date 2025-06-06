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

import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, TextField, MenuItem } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from 'context/auth-context';
import ModalContext from 'context/modal-context';
import deckService from 'services/deckService';
import sheetService from 'services/sheetService';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface DeckManagementModalProps {
    userId: string,
    addListDialogOpen: boolean,
    closeDialog: () => void,
}

// Utility function to extract Google Sheet ID from URL or return as-is if already an ID
function extractSheetId(input: string): string | null {
    // Regex to match Google Sheets URL and extract the ID
    const urlPattern = /https?:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = input.match(urlPattern);
    if (match && match[1]) {
        return match[1];
    }
    // If input looks like a valid ID (alphanumeric, dashes, underscores, length 20+)
    if (/^[a-zA-Z0-9-_]{20,}$/.test(input)) {
        return input;
    }
    return null;
}

const DeckManagementModal = (props: DeckManagementModalProps) => {

    const [deckName, setDeckName] = useState('')
    const [deckId, setDeckId] = useState('')
    const [makePublic, setMakePublic] = useState(true)
    const [id, setId] = useState('')
    const [deckErrorMsg, setDeckErrorMsg] = useState('')
    const [nativeLangauge, setNativeLanguage] = useState('English')
    const [learningLanguage, setLearningLanguage] = useState('')
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    const authCtx = useContext(AuthContext);
    const modalCtx = useContext(ModalContext);
    const dialogOpen = props.addListDialogOpen;

    const isAdd = modalCtx.mode === 'add'
    const isEdit = modalCtx.mode === 'edit'

    const languageOptions = [
        'English',
        'Spanish',
        'French',
        'German'
    ]

    useEffect(() => {
        const existingDeck = modalCtx.existingDeck
        const resetState = () => {
            setDeckName('')
            setDeckId('')
            setNativeLanguage('English')
            setLearningLanguage('')
            setMakePublic(true)
            setId('')
        }
        if(existingDeck && Object.keys(existingDeck).length > 0) {
            console.log('existingDeck', existingDeck)
            setDeckName(existingDeck.deck_name || '')
            setDeckId(existingDeck.deck_id || '')
            setNativeLanguage(existingDeck.Language1 || '')
            setLearningLanguage(existingDeck.Language2 || '')
            setMakePublic(existingDeck.isPublic || false)
            setId(existingDeck.id || '')
        } else {
            resetState()
        }
    }, [modalCtx.existingDeck])

    function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.name === 'DeckName') {
            setDeckName(event.target.value)
        }
        if (event.target.name === 'DeckID') {
            setDeckId(event.target.value)
        }
        if (event.target.name === 'NativeLanguage') {
            setNativeLanguage(event.target.value);
        }
        if (event.target.name === 'LearningLanguage') {
            setLearningLanguage(event.target.value);
        }
        if (event.target.name === 'MakePublic') {
            setMakePublic(event.target.checked)
        }
    }

    function handleSubmit () {
        function handleResult(result: any) {
            console.log('new deck result', result)
            handleClose()
        }

        function sendRequest(sheetId: string) {
            if(isAdd) {
                deckService.addDeck(deckName, sheetId, nativeLangauge, learningLanguage, makePublic, authCtx.userToken, authCtx.userId).then(
                    handleResult,
                    (error) => {
                        console.log(error);
                    }
                )
            } else if (isEdit) {
                deckService.updateDeck(deckName, sheetId, nativeLangauge, learningLanguage, makePublic, id, authCtx.userToken).then(
                    handleResult,
                    (error) => {
                        console.log(error);
                    }
                )
            }
        }
        
        // Extract Sheet ID from input (URL or ID)
        const extractedId = extractSheetId(deckId);
        if (!extractedId) {
            setDeckErrorMsg('Please enter a valid Google Sheet URL or ID.');
            return;
        }
        // Check if valid
        sheetService.checkSheetValidity(extractedId)
        .then(response => {
            if (response.status === 200) {
                setDeckErrorMsg('')
                sendRequest(extractedId)
            } else {
                setDeckErrorMsg('Unable to validate Sheet ID')
            }
        })
        .catch((error) => {
            console.error('Error', error)
        })
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
                    inputProps={{ "data-testid": "deck-name-input" } as any}
                />
                <TextField
                    onChange={handleChange}
                    value={deckId}
                    id="addNewDeckID"
                    name="DeckID"
                    label="Deck ID or Google Sheet URL"
                    type="text"
                    fullWidth
                    margin="normal"
                    error={deckErrorMsg !== ''}
                    helperText={deckErrorMsg}
                    inputProps={{ "data-testid": "deck-id-input" } as any}
                />
                <div className="deck-management-modal-sheet-info-row">
                    <span className="deck-management-modal-sheet-info-text">
                        The Google Sheet must be shared with 'Anyone with the link'.
                    </span>
                    <IconButton
                        className="deck-management-modal-sheet-info-icon-btn"
                        size="small"
                        aria-label="How to share Google Sheet"
                        onClick={() => setInfoModalOpen(true)}
                    >
                        <InfoOutlinedIcon className="deck-management-modal-sheet-info-icon" fontSize="small" />
                    </IconButton>
                </div>
                <Dialog open={infoModalOpen} onClose={() => setInfoModalOpen(false)} className='deck-management-modal'>
                    <div className="deck-management-modal-header-row">
                        <DialogTitle className="deck-management-modal-title">How to share your Google Sheet</DialogTitle>
                        <IconButton
                            className="deck-management-modal-close-btn"
                            aria-label="Close info modal"
                            size="small"
                            onClick={() => setInfoModalOpen(false)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <DialogContent>
                        <div className="deck-management-modal-sheet-modal-content">
                            <ol>
                                <li>Open your Google Sheet.</li>
                                <li>Click the <b>Share</b> button (top right).</li>
                                <li>In the dialog, click <b>General access</b> and select <b>Anyone with the link</b>.</li>
                                <li>Set the role to <b>Viewer</b>.</li>
                                <li>Click <b>Copy link</b> and paste it above.</li>
                            </ol>
                            <div className="deck-management-modal-sheet-modal-img-placeholder">
                                <img src="/images/sharing-sheet-with-anyone.jpg" alt="How to share Google Sheet" />
                            </div>
                            <div style={{fontSize: '0.9em', marginTop: 8}}>
                                <a href="https://support.google.com/docs/answer/2494822?hl=en" target="_blank" rel="noopener noreferrer">See Google's official help</a>
                            </div>
                            <button className="deck-management-modal-sheet-modal-back-btn" onClick={() => setInfoModalOpen(false)}>
                                Back
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
                <TextField
                    select
                    onChange={handleChange}
                    value={nativeLangauge}
                    id="nativeLanguage"
                    name="NativeLanguage"
                    label="Native Language"
                    fullWidth
                    margin="normal"
                    inputProps={{ "data-testid": "native-language-input" } as any}
                >
                    {languageOptions.map((language, index) => (
                        <MenuItem key={index} value={language}>{language}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    onChange={handleChange}
                    value={learningLanguage}
                    id="learningLanguage"
                    name="LearningLanguage"
                    label="Learning Language"
                    fullWidth
                    margin="normal"
                    inputProps={{ "data-testid": "learning-language-input" } as any}
                >
                    {languageOptions.map((language, index) => (
                        <MenuItem key={index} value={language}>{language}</MenuItem>
                    ))}
                </TextField>
                
                <FormControlLabel
                    control={
                        <Checkbox
                        onChange={handleChange}
                        value={makePublic}
                        checked={makePublic}
                        name="MakePublic"
                        defaultChecked
                        inputProps={{ "data-testid": "make-public-checkbox" } as any}
                        />
                    } 
                    label="Share this deck with the community to contribute to our growing collection of resources. Uncheck this box if you prefer to keep this deck private."
                />
                
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleSubmit}
                    data-testid="submit-deck-button"
                >
                    {isAdd ? "Add Deck" : "Save Deck"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeckManagementModal;
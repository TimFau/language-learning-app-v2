// Modal that appears after a deck is completed

import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Icon } from "@mui/material"

interface DeckFinishedModalProps {
    langOneArr: string[],
    goToDeckSelector: () => void
}

const DeckFinishedModal = ({ langOneArr, goToDeckSelector }: DeckFinishedModalProps) => (
    <Dialog id="success-modal" open={langOneArr.length === 0}>
        <Icon color="primary" className="congrats-icon">emoji_events</Icon>
        <DialogTitle>
            Congratulations!
        </DialogTitle>
        <DialogContent>
            <h3>You've finished the list!</h3>
        </DialogContent>
        <ButtonGroup
            color="primary"
            variant="outlined"
            fullWidth
        >
            <Button variant="contained" onClick={goToDeckSelector}>Return to Deck Loader</Button>
        </ButtonGroup>
    </Dialog>
)

export default DeckFinishedModal
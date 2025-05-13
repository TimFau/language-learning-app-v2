import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

type DialogLogoutWarningProps = {
    setDeckStartedTrue: () => void,
    logOutDialogOpen: boolean,
    setLogOutDialogOpen: (value: boolean) => void,
    logout: (value: boolean) => void
}

const DialogLogoutWarning = (props: DialogLogoutWarningProps) => {return (
    <Dialog
        open={props.logOutDialogOpen}
        onClose={() => props.setLogOutDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
        {"Logout and close deck?"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Logging out now will close the current deck without saving your progress. Would you like to continue?
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => props.setLogOutDialogOpen(false)}>No</Button>
        <Button onClick={() => props.logout(true)} autoFocus>
            Yes
        </Button>
        </DialogActions>
    </Dialog>
)}
export default DialogLogoutWarning
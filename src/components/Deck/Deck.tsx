import ProgressBar from './ProgressBar';
import FlashCard from './Modes/FlashCard';
import WordBank from './Modes/WordBank';
import Keyboard from './Modes/Keyboard';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import Icon from '@mui/material/Icon';
import { keyboardModeHandleChangeEvent, handleSubmitType } from './MainApp';


type RootState = {
    language1: string | undefined,
    language2: string | undefined,
    langFrom: Array<string>,
    langTo: Array<string>,
    translationInputValue: string,
    wordBank: Array<string>,
    translateMode: string,
    inputMode: string,
    showAnswer: boolean,
    randomNum: number,
    langOneArrLength: number,
    initialCount: number,
    handleSubmit: (event: handleSubmitType) => void,
    showAnswerFc: () => void,
    getCard: () => void,
    archiveCard: () => void,
    keyboardModeHandleChange: (event: keyboardModeHandleChangeEvent) => void,
    goToDeckSelector: () => void,
}

function Deck(props: RootState) {
    return (
        <div className="wrapper">
            <ProgressBar 
                langOneArrLength={props.langOneArrLength}
                initialCount={props.initialCount}
            />
            <form onSubmit={props.handleSubmit}  id="mainApp">
                {props.inputMode === 'Flashcard' ?
                    <FlashCard 
                    showAnswerFc={props.showAnswerFc}
                    showAnswer={props.showAnswer}
                    getCard={props.getCard}
                    archiveCard={props.archiveCard}
                    langTo={props.langTo}
                    langFrom={props.langFrom}
                    randomNum={props.randomNum}
                    >
                        Translate to <span>{props.translateMode === "1to2" ? props.language2 : props.language1}</span>
                    </FlashCard>
                : null }
                {props.inputMode === 'Keyboard' ?
                    <Keyboard 
                        langTo={props.langTo}
                        langFrom={props.langFrom}
                        randomNum={props.randomNum}
                        translationInputValue={props.translationInputValue}
                        keyboardModeHandleChange={(event: keyboardModeHandleChangeEvent) => props.keyboardModeHandleChange(event)}
                    >
                        Translate to <span>{props.translateMode === "1to2" ? props.language2 : props.language1}</span>
                    </Keyboard>
                : null }
                {props.inputMode === 'Wordbank' ?
                    <WordBank 
                        langTo={props.langTo}
                        langFrom={props.langFrom}
                        randomNum={props.randomNum}
                        wordBank={props.wordBank}
                        keyboardModeHandleChange={(event: keyboardModeHandleChangeEvent) => props.keyboardModeHandleChange(event)}
                    >
                        Translate to <span>{props.translateMode === "1to2" ? props.language2 : props.language1}</span>
                    </WordBank>
                : null }
            </form>
            <Dialog id="success-modal" open={props.langOneArrLength === 0}>
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
                    <Button variant="contained" onClick={props.goToDeckSelector}>Return to Deck Loader</Button>
                </ButtonGroup>
            </Dialog>
        </div>
    )
}

export default Deck
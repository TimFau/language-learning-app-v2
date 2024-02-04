import { useEffect } from 'react';

import ProgressBar from '../components/Deck/ProgressBar';
import FlashCard from '../components/Deck/Modes/FlashCard';
import WordBank from '../components/Deck/Modes/WordBank';
import Keyboard from '../components/Deck/Modes/Keyboard';
import { keyboardModeHandleChangeEvent, handleSubmitType } from '../components/Deck/MainApp';
import DeckDialog from '../components/Deck/DeckDialog';
import BottomButtonsContainer from '../components/Deck/BottomButtonsContainer';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import Icon from '@mui/material/Icon';


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
    currentListName: string,
    handleSubmit: (event: handleSubmitType) => void,
    showAnswerFc: () => void,
    getCard: () => void,
    archiveCard: () => void,
    keyboardModeHandleChange: (event: keyboardModeHandleChangeEvent) => void,
    goToDeckSelector: () => void,
    deckOptions: (listName: string, listId: string) => void,
    setInputMode: React.Dispatch<React.SetStateAction<string>>,
    setDialogClosed: React.Dispatch<React.SetStateAction<string>>,
    deckDialogOpen: boolean,
    setTranslationMode1: () => void,
    setTranslationMode2: () => void,
    startDeck: () => void,
    deckDataLoaded: boolean,
    setDeckDialogClose: () => void,
    langOneArr: string[],
    langTwoArr: string[],
    success: boolean,
    incorrect: boolean
}

function Deck(props: RootState) {
    const queryParams = new URLSearchParams(window.location.search)
    const name: any = queryParams.get("name")
    const id: any = queryParams.get("id")

    useEffect(() => {
        props.deckOptions(name, id)
    }, [name, id])

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
            <DeckDialog
                inputMode={props.inputMode}
                currentListName={props.currentListName}
                setInputMode={props.setInputMode}
                setDialogClosed={props.setDeckDialogClose}
                deckDialogOpen={props.deckDialogOpen}
                setTranslationMode1={props.setTranslationMode1}
                setTranslationMode2={props.setTranslationMode2}
                translateMode={props.translateMode}
                language1={props.language1}
                language2={props.language2}
                startDeck={props.startDeck}
                deckDataLoaded={props.deckDataLoaded}
            />
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
            {props.inputMode !== 'Flashcard' &&
                <BottomButtonsContainer 
                    handleSubmit={props.handleSubmit}
                    translateMode={props.translateMode}
                    getCard={props.getCard}
                    randomNum={props.randomNum}
                    langOneArr={props.langOneArr}
                    langTwoArr={props.langTwoArr}
                    success={props.success}
                    incorrect={props.incorrect}
                    showAnswer={props.showAnswer}
                />
            }
        </div>
    )
}

export default Deck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProgressBar from '../components/Deck/ProgressBar';
import FlashCard from '../components/Deck/Modes/FlashCard';
import WordBank from '../components/Deck/Modes/WordBank';
import Keyboard from '../components/Deck/Modes/Keyboard';
import { keyboardModeHandleChangeEvent, handleSubmitType } from './../types';
import DeckDialog from '../components/Deck/DeckDialog';
import BottomButtonsContainer from '../components/Deck/BottomButtonsContainer';

import { wordBankHelper } from './../scripts/Helpers';

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import Icon from '@mui/material/Icon';


type RootState = {
    deckDialogOpen: boolean,
    setDeckDialogClose: () => void,
    setDeckDialogOpen: () => void,
    setDeckStartedFalse: () => void,
    setDeckStartedTrue: () => void,
    deckStarted: boolean
}

// global vars
var langOneArr: string[];
var langTwoArr: string[];
var langOneArrInit: string[];
var langTwoArrInit: string[];

function Deck(props: RootState) {
    const queryParams = new URLSearchParams(window.location.search)
    const name: any = queryParams.get("name")
    const id: any = queryParams.get("id")
    const navigate = useNavigate()

    // State Functions
    const [language1, setLanguage1] = useState<string | undefined>('');
    const [language2, setLanguage2] = useState<string | undefined>('');
    const [langFrom, setLangFrom] = useState<Array<string>>([]);
    const [langTo, setLangTo] = useState<Array<string>>([]);
    const [translationInputValue, setTranslationInputValue] = useState<string>('');
    const [wordBank, setWordBank] = useState<Array<string>>([]);
    const [translateMode, setTranslateMode] = useState<string>('1to2');
    const [inputMode, setInputMode] = useState<string>('Flashcard');
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [incorrect, setIncorrect] = useState<boolean>(false);
    const [currentListName, setCurrentListName] = useState<string>('');
    const [deckDataLoaded, setDeckDataLoaded] = useState<boolean>(false);
    const [randomNum, setRandomNum] = useState<number>(0);
    const [initialCount, setInitialCount] = useState<number>(0);
    const [checkAccents] = useState<boolean>(false);

    // Original Functions
    function getDeckData(value: string) {
        const request = `${process.env.REACT_APP_GOOGLE_SHEET_API}/${value}/Sheet1`;
        fetch(request, {mode: 'cors'})
            .then( response => {
                return response.json();
            })
            .then( data => {
                langOneArr = [];
                langTwoArr = [];
                if (data.length > 0) {
                    data.forEach(function(item: { Language1: string; Language2: string; }){
                        console.log('getDeckData', data)
                        langOneArr.push(item.Language1);
                        langTwoArr.push(item.Language2);
                    })
                } else if (data.error) {
                    console.log('Deck Load Error: ' + data.error)
                } else {
                    console.log('Data is empty; Deck not loaded')
                }
                setLanguage1(langOneArr.shift());
                setLanguage2(langTwoArr.shift());
                setInitialCount(langOneArr.length);
                setRandomNum(Math.floor(Math.random() * langOneArr.length));
                setSuccess(false);
                setIncorrect(false);
                setDeckDataLoaded(true);
                langOneArrInit = langOneArr.slice();
                langTwoArrInit = langTwoArr.slice();
                props.setDeckDialogOpen();
            })
            .catch((error) => {
                console.error('Error', error);
                props.setDeckDialogClose();
            })
    }

    function getCard() {
        if (success) {
            langOneArr.splice(randomNum, 1);
            langTwoArr.splice(randomNum, 1);
        }
        setRandomNum(Math.floor(Math.random() * langOneArr.length));
        setSuccess(false);
        setIncorrect(false);
        setTranslationInputValue('');
        setLangFrom(translateMode === '1to2' ? langOneArr : langTwoArr);
        setLangTo(translateMode === '1to2' ? langTwoArr : langOneArr);
        setShowAnswer(false);
        handleWordBank();
    }

    function archiveCard() {
        langOneArr.splice(randomNum, 1);
        langTwoArr.splice(randomNum, 1);
        getCard();
    }

    function handleWordBank() {
        if(translateMode === '1to2'){
            setWordBank(wordBankHelper(randomNum, langTwoArr, langTwoArrInit));
        } else {
            setWordBank(wordBankHelper(randomNum, langOneArr, langOneArrInit));
        }
    }

    function handleSubmit(event: handleSubmitType) {
        event.preventDefault();
        var inputValueRegex = translationInputValue.toLowerCase().trim().replace(/\./g,'');
        var correctAnswerRegex = langTo[randomNum].toLowerCase().trim().replace(/\./g,'');
        if(checkAccents === false) {
            inputValueRegex = inputValueRegex.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            correctAnswerRegex = correctAnswerRegex.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        if (inputValueRegex === correctAnswerRegex) {
            setSuccess(true);
        }  else {
            setIncorrect(true);
        }
        setShowAnswer(true);
    }

    // State Handlers
    function keyboardModeHandleChange(event: keyboardModeHandleChangeEvent) {
        setTranslationInputValue(event.currentTarget.value)
    }
    function switchInput(value: string) {
        if(value === 'Wordbank'){
            setInputMode('Wordbank');
            handleWordBank();
        } else if(value === 'Keyboard' && inputMode !== 'Keyboard'){
            setInputMode('Keyboard');
        } else if(value === 'Flashcard' && inputMode !== 'Flashcard'){
            setInputMode('Flashcard');
        }
    }
    function setTranslationMode1() {
        setTranslateMode('1to2');
        setLangFrom(langOneArr);
        setLangTo( langTwoArr);
    }
    function setTranslationMode2() {
        setTranslateMode('2to1');
        setLangFrom(langTwoArr);
        setLangTo(langOneArr);
    }
    function goToDeckSelector() {
        props.setDeckStartedFalse();
        props.setDeckDialogClose();
        navigate('/')
    }
    function deckOptions(listName: string, listId: string) {
        setDeckDataLoaded(false);
        getDeckData(listId)
        setCurrentListName(listName);
        // props.setDemoDrawerClosed();
        props.setDeckDialogOpen();
    }
    function startDeck() {
        getCard();
        switchInput(inputMode)
        props.setDeckStartedTrue();
        props.setDeckDialogClose();
    }
    function showAnswerFc() {
        setShowAnswer(true);
    }

    useEffect(() => {
        deckOptions(name, id)
    }, [name, id])

    return (
        <div className="wrapper">
            <ProgressBar 
                langOneArrLength={langOneArr?.length}
                initialCount={initialCount}
            />
            <form onSubmit={handleSubmit}  id="mainApp">
                {inputMode === 'Flashcard' ?
                    <FlashCard 
                    showAnswerFc={showAnswerFc}
                    showAnswer={showAnswer}
                    getCard={getCard}
                    archiveCard={archiveCard}
                    langTo={langTo}
                    langFrom={langFrom}
                    randomNum={randomNum}
                    >
                        Translate to <span>{translateMode === "1to2" ? language2 : language1}</span>
                    </FlashCard>
                : null }
                {inputMode === 'Keyboard' ?
                    <Keyboard 
                        langTo={langTo}
                        langFrom={langFrom}
                        randomNum={randomNum}
                        translationInputValue={translationInputValue}
                        keyboardModeHandleChange={(event: keyboardModeHandleChangeEvent) => keyboardModeHandleChange(event)}
                    >
                        Translate to <span>{translateMode === "1to2" ? language2 : language1}</span>
                    </Keyboard>
                : null }
                {inputMode === 'Wordbank' ?
                    <WordBank 
                        langTo={langTo}
                        langFrom={langFrom}
                        randomNum={randomNum}
                        wordBank={wordBank}
                        keyboardModeHandleChange={(event: keyboardModeHandleChangeEvent) => keyboardModeHandleChange(event)}
                    >
                        Translate to <span>{translateMode === "1to2" ? language2 : language1}</span>
                    </WordBank>
                : null }
            </form>
            <DeckDialog
                inputMode={inputMode}
                currentListName={currentListName}
                setInputMode={setInputMode}
                setDialogClosed={props.setDeckDialogClose}
                deckDialogOpen={props.deckDialogOpen}
                setTranslationMode1={setTranslationMode1}
                setTranslationMode2={setTranslationMode2}
                translateMode={translateMode}
                language1={language1}
                language2={language2}
                startDeck={startDeck}
                deckDataLoaded={deckDataLoaded}
            />
            <Dialog id="success-modal" open={langOneArr?.length === 0}>
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
            {/* TODO: Re-build functionality for DialogLogoutWarning. Temporarily, the logout option is hidden from the deck page. */}
            {/* <DialogLogoutWarning 
                setDeckStartedTrue={props.setDeckStartedTrue}
                logOutDialogOpen={logOutDialogOpen}
                setLogOutDialogOpen={setLogOutDialogOpen}
                logout={logout}
            /> */}
            {inputMode !== 'Flashcard' &&
                <BottomButtonsContainer 
                    handleSubmit={handleSubmit}
                    translateMode={translateMode}
                    getCard={getCard}
                    randomNum={randomNum}
                    langOneArr={langOneArr}
                    langTwoArr={langTwoArr}
                    success={success}
                    incorrect={incorrect}
                    showAnswer={showAnswer}
                />
            }
        </div>
    )
}

export default Deck
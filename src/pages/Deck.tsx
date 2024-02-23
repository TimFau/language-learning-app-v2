import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sheetService from 'services/sheetService';

import ProgressBar from '../components/Deck/ProgressBar';
import FlashCard from '../components/Deck/Modes/FlashCard';
import WordBank from '../components/Deck/Modes/WordBank';
import Keyboard from '../components/Deck/Modes/Keyboard';
import { keyboardModeHandleChangeEvent, handleSubmitType } from '../types';
import DeckDialog from '../components/Deck/DeckDialog';
import BottomButtonsContainer from '../components/Deck/BottomButtonsContainer';

import { wordBankHelper } from '../scripts/Helpers';

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
var langOneArrInit: string[];
var langTwoArrInit: string[];

function Deck(props: RootState) {
    const queryParams = new URLSearchParams(window.location.search)
    const name: any = queryParams.get("name")
    const id: any = queryParams.get("id")
    const navigate = useNavigate()

    // State Functions
    const [langArr, setLangArr] = useState<{ langOneArr: string[], langTwoArr: string[] }>({
        langOneArr: [],
        langTwoArr: []
    });
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
    const [currentDeckName, setCurrentDeckName] = useState<string>('');
    const [deckDataLoaded, setDeckDataLoaded] = useState<boolean>(false);
    const [randomNum, setRandomNum] = useState<number>(0);
    const [initialCount, setInitialCount] = useState<number>(0);
    const [checkAccents] = useState<boolean>(false);
    const { setDeckDialogOpen, setDeckDialogClose } = props;

    // Original Functions
    function getCard(currentLangOneArr?: string[], currentLangTwoArr?: string[]) {
        let newLangOneArr = Array.isArray(currentLangOneArr) ? [...currentLangOneArr] : [...langArr.langOneArr]
        let newLangTwoArr = Array.isArray(currentLangTwoArr) ? [...currentLangTwoArr] : [...langArr.langTwoArr]
        if (success) {
            newLangOneArr.splice(randomNum, 1);
            newLangTwoArr.splice(randomNum, 1);
        }
        const newRandomNum = Math.floor(Math.random() * newLangOneArr.length)
        setRandomNum(newRandomNum);
        setSuccess(false);
        setIncorrect(false);
        setTranslationInputValue('');
        setLangFrom(translateMode === '1to2' ? newLangOneArr : newLangTwoArr);
        setLangTo(translateMode === '1to2' ? newLangTwoArr : newLangOneArr);
        setShowAnswer(false);
        setLangArr({
            langOneArr: newLangOneArr,
            langTwoArr: newLangTwoArr
        })
        handleWordBank();
    }

    function archiveCard() {
        let newLangOneArr = [...langArr.langOneArr];
        let newLangTwoArr = [...langArr.langTwoArr];
        newLangOneArr.splice(randomNum, 1);
        newLangTwoArr.splice(randomNum, 1);
        setLangArr({
            langOneArr: newLangOneArr,
            langTwoArr: newLangTwoArr
        });
        getCard(newLangOneArr, newLangTwoArr);
    }

    function handleWordBank() {
        if(translateMode === '1to2'){
            setWordBank(wordBankHelper(randomNum, langArr.langTwoArr, langTwoArrInit));
        } else {
            setWordBank(wordBankHelper(randomNum, langArr.langOneArr, langOneArrInit));
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
        setLangFrom(langArr.langOneArr);
        setLangTo(langArr.langTwoArr);
    }
    function setTranslationMode2() {
        setTranslateMode('2to1');
        setLangFrom(langArr.langTwoArr);
        setLangTo(langArr.langOneArr);
    }
    function goToDeckSelector() {
        props.setDeckStartedFalse();
        props.setDeckDialogClose();
        navigate('/')
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
        function getDeckData(value: string) {
            sheetService.getSheet(value).then( data => {
                let newLangOneArr: string[] = [];
                let newLangTwoArr: string[] = [];
                if (data.length > 0) {
                    data.forEach(function(item: { Language1: string; Language2: string; }){
                        // console.log('getDeckData', data)
                        newLangOneArr.push(item.Language1);
                        newLangTwoArr.push(item.Language2);
                    })
                } else if (data.error) {
                    console.log('Deck Load Error: ' + data.error)
                } else {
                    console.log('Data is empty; Deck not loaded')
                }
                setLanguage1(newLangOneArr.shift());
                setLanguage2(newLangTwoArr.shift());
                setInitialCount(newLangOneArr.length);
                setRandomNum(Math.floor(Math.random() * newLangOneArr.length));
                setSuccess(false);
                setIncorrect(false);
                setDeckDataLoaded(true);
                langOneArrInit = newLangOneArr.slice();
                langTwoArrInit = newLangTwoArr.slice();
                setLangArr({
                    langOneArr: newLangOneArr,
                    langTwoArr: newLangTwoArr
                })
                setDeckDialogOpen();
            })
            .catch((error) => {
                console.error('Error', error);
                setDeckDialogClose();
            })
        }
        function deckOptions(deckName: string, deckId: string) {
            setDeckDataLoaded(false);
            getDeckData(deckId)
            setCurrentDeckName(deckName);
            // props.setDemoDrawerClosed();
            setDeckDialogOpen();
        }
        deckOptions(name, id)
    }, [name, id, setDeckDialogClose, setDeckDialogOpen])

    return (
        <div className={"container page-container " + inputMode}>
            <div className="wrapper">
                <ProgressBar 
                    langOneArrLength={langArr.langOneArr.length}
                    initialCount={initialCount}
                />
                <form onSubmit={handleSubmit}  id="mainApp">
                    {inputMode === 'Flashcard' &&
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
                    }
                    {inputMode === 'Keyboard' &&
                        <Keyboard 
                            langTo={langTo}
                            langFrom={langFrom}
                            randomNum={randomNum}
                            translationInputValue={translationInputValue}
                            keyboardModeHandleChange={(event: keyboardModeHandleChangeEvent) => keyboardModeHandleChange(event)}
                        >
                            Translate to <span>{translateMode === "1to2" ? language2 : language1}</span>
                        </Keyboard>
                    }
                    {inputMode === 'Wordbank' &&
                        <WordBank 
                            langTo={langTo}
                            langFrom={langFrom}
                            randomNum={randomNum}
                            wordBank={wordBank}
                            keyboardModeHandleChange={(event: keyboardModeHandleChangeEvent) => keyboardModeHandleChange(event)}
                        >
                            Translate to <span>{translateMode === "1to2" ? language2 : language1}</span>
                        </WordBank>
                    }
                </form>
                <DeckDialog
                    inputMode={inputMode}
                    currentDeckName={currentDeckName}
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
                <Dialog id="success-modal" open={langArr.langOneArr?.length === 0}>
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
                        getCard={() => getCard()}
                        randomNum={randomNum}
                        langOneArr={langArr.langOneArr}
                        langTwoArr={langArr.langTwoArr}
                        success={success}
                        incorrect={incorrect}
                        showAnswer={showAnswer}
                    />
                }
            </div>
        </div>
    )
}

export default Deck
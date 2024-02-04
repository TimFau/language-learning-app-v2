import React, { useState, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { wordBankHelper } from '../../scripts/Helpers';
import AuthContext from 'context/auth-context';

import BottomButtonsContainer from './BottomButtonsContainer';

import Nav from '../Nav';
import Deck from './Deck';
import LoggedOut from '../LoggedOut'
import LoggedIn from '../LoggedIn';
import DemoDecksDrawer from './DeckSelector/DemoDecksDrawer';
import DeckDialog from './DeckDialog';
import Login from '../LoggedOut/Login';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material/';

// global vars
var langOneArr: string[];
var langTwoArr: string[];
var langOneArrInit: string[];
var langTwoArrInit: string[];

export type handleSubmitType = React.FormEvent<HTMLInputElement | HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

export type keyboardModeHandleChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>;

function TranslationApp (props: PropsFromRedux) {
    const authCtx = useContext(AuthContext);

    // State Functions
    const [language1, setLanguage1] = useState<string | undefined>('');
    const [language2, setLanguage2] = useState<string | undefined>('');
    const [langFrom, setLangFrom] = useState<Array<string>>([]);
    const [langTo, setLangTo] = useState<Array<string>>([]);
    const [translationInputValue, setTranslationInputValue] = useState<string>('');
    const [wordBank, setWordBank] = useState<Array<string>>([]);
    // const [deckLoadingMsg, setDeckLoadingMsg] = useState<string>('');
    const [translateMode, setTranslateMode] = useState<string>('1to2');
    const [inputMode, setInputMode] = useState<string>('Flashcard');
    const [checkAccents] = useState<boolean>(false);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [incorrect, setIncorrect] = useState<boolean>(false);
    // const [deckLoadingError, setDeckLoadingError] = useState<boolean>(false);
    // const [currentListId, setCurrentListId] = useState<string>('');
    const [currentListName, setCurrentListName] = useState<string>('');
    const [deckDataLoaded, setDeckDataLoaded] = useState<boolean>(false);
    const [logOutDialogOpen, setLogOutDialogOpen] = useState<boolean>(false);
    const [randomNum, setRandomNum] = useState<number>(0);
    // const [randomNum2, setRandomNum2] = useState<number>(0);
    const [initialCount, setInitialCount] = useState<number>(0);

    // Original Functions
    function getDeckData(value: string) {
        let request = `${process.env.REACT_APP_GOOGLE_SHEET_API}/${value}/Sheet1`;
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
                // setRandomNum2((Math.floor(Math.random() * langOneArr.length) - 4));
                setSuccess(false);
                setIncorrect(false);
                // setDeckLoadingError(false);
                // setDeckLoadingMsg('');
                setDeckDataLoaded(true);
                langOneArrInit = langOneArr.slice();
                langTwoArrInit = langTwoArr.slice();
                props.setDeckDialogOpen();
            })
            .catch((error) => {
                console.error('Error', error);
                // setDeckLoadingError(true);
                // setDeckLoadingMsg('There was an issue loading the deck. Please check the Spreadsheet ID and share settings.');
                props.setDeckDialogClose();
            })
    }

    function getCard() {
        if (success) {
            langOneArr.splice(randomNum, 1);
            langTwoArr.splice(randomNum, 1);
        }
        setRandomNum(Math.floor(Math.random() * langOneArr.length));
        // setRandomNum2(Math.floor(Math.random() * langOneArrInit.length));
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
    function showAnswerFc() {
        setShowAnswer(true);
    }
    function goToDeckSelector() {
        props.setDeckStartedFalse();
        props.setDeckDialogClose();
    }
    function deckOptions(listName: string, listId: string) {
        setDeckDataLoaded(false);
        getDeckData(listId)
        setCurrentListName(listName);
        // setCurrentListId(listId);
        props.setDemoDrawerClosed();
        props.setDeckDialogOpen();
    }
    function startDeck() {
        getCard();
        switchInput(inputMode)
        props.setDeckStartedTrue();
        props.setDeckDialogClose();
    }
    function logout(endDeck = false) {
        if (props.deckStarted && !endDeck) {
            setLogOutDialogOpen(true)
        } else {
            props.setDeckStartedFalse();
            authCtx.onLogout();
            setLogOutDialogOpen(false);
        }
    };
  
    return (
        <BrowserRouter>
        <Nav logout={() => logout(false)} />
        <div className={"container main-container " + inputMode}>
            {props.deckStarted ?
                <Deck
                    handleSubmit={handleSubmit}
                    inputMode={inputMode}
                    showAnswerFc={showAnswerFc}
                    showAnswer={showAnswer}
                    getCard={getCard}
                    archiveCard={archiveCard}
                    langTo={langTo}
                    langFrom={langFrom}
                    randomNum={randomNum}
                    translateMode={translateMode}
                    language1={language1}
                    language2={language2}
                    translationInputValue={translationInputValue}
                    keyboardModeHandleChange={keyboardModeHandleChange}
                    wordBank={wordBank}
                    goToDeckSelector={goToDeckSelector}
                    langOneArrLength={langOneArr.length}
                    initialCount={initialCount}
                />
            : null }
            {((!props.deckStarted) && (authCtx.userToken === '')) &&
                <React.Fragment>
                    <LoggedOut />
                    <DemoDecksDrawer 
                        deckOptions={deckOptions}
                        open={props.demoDrawerOpen}
                        onClose={props.setDemoDrawerClosed}
                    />
                </React.Fragment>
            }
            {(!props.deckStarted && authCtx.userToken) &&
                <LoggedIn deckOptions={deckOptions} />
            }
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
            >
            </DeckDialog>
                {inputMode !== 'Flashcard' && props.deckStarted ?
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
            : null }
            </div>
        <Login />
        <Dialog
            open={logOutDialogOpen}
            onClose={() => setLogOutDialogOpen(false)}
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
            <Button onClick={() => setLogOutDialogOpen(false)}>No</Button>
            <Button onClick={() => logout(true)} autoFocus>
                Yes
            </Button>
            </DialogActions>
        </Dialog>
        </BrowserRouter>
    )
}

interface mapStateToPropsProps {
    deckStarted: boolean,
    deckDialogOpen: boolean,
    demoDrawerOpen: boolean,
}

const mapStateToProps = (state: mapStateToPropsProps) => ({
    deckStarted: state.deckStarted,
    deckDialogOpen: state.deckDialogOpen,
    demoDrawerOpen: state.demoDrawerOpen,
})

const mapDispatchToProps = {
    setDeckDialogOpen: () => ({type: 'deck/setDialog', value: true}),
    setDeckDialogClose: () => ({type: 'deck/setDialog', value: false}),
    setDeckStartedTrue: () => ({type: 'deck/setDeckStarted', value: true}),
    setDeckStartedFalse: () => ({type: 'deck/setDeckStarted', value: false}),
    setDemoDrawerOpen: () => ({type: 'deck/setDemoDrawer', value: true}),
    setDemoDrawerClosed: () => ({type: 'deck/setDemoDrawer', value: false}),
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(TranslationApp);
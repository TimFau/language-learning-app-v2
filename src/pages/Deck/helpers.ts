import { langArray } from './Index'


function shuffle(array: Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    } return array;
}

export function wordBankHelper(translationsArr: Array<string>, initLangArr: Array<string>, currentRandomNum: number) {
    const answer = translationsArr[currentRandomNum];
    var returnValue = [answer];
    var i = 0;
    while (returnValue.length < 4 && i < 10) {
        i++;
        const initArrIndex = Math.floor(Math.random() * initLangArr.length);
        const randomCard = initLangArr[initArrIndex]
        if (randomCard) {
            returnValue = returnValue.concat(randomCard);
            let removeDuplicates = new Set(returnValue); // removes duplicates
            returnValue = [...removeDuplicates]; // converts back to array
        }
    }
    const wordBankArr = shuffle(returnValue);
    return wordBankArr;
}

export const generateRandomNum = (arr: langArray) => {
    return Math.floor(Math.random() * arr.length)
}
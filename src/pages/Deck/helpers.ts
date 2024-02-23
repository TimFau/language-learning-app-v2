import { langArray } from './Index'


function shuffle(array: Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    } return array;
}

export function wordBankHelper(ranNum1: number, curArr: Array<string>, initArr: Array<string>) {
    var returnValue = [curArr[ranNum1]];
    var i = 0;
    while (returnValue.length < 4 && i < 10) {
        i++;
        returnValue = returnValue.concat(initArr[Math.floor(Math.random() * initArr.length)]);
        let removeDuplicates = new Set(returnValue); // removes duplicates
        returnValue = [...removeDuplicates]; // converts back to array
    }
    return (
        shuffle(returnValue)
    )
}

export const generateRandomNum = (arr: langArray) => {
    return Math.floor(Math.random() * arr.length)
}
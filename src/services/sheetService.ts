const getSheet = (sheetId: string) => {
    const request = `${process.env.REACT_APP_GOOGLE_SHEET_API}/${sheetId}/Sheet1`;
    return fetch(request, {mode: 'cors'})
        .then( response => {
            return response.json();
        })
}

const checkSheetValidity = (sheetId: string) => {
    const request = `${process.env.REACT_APP_GOOGLE_SHEET_API}/${sheetId}/Sheet1`;
    return fetch(request, {mode: 'cors'})
        .then( response => {
            return response
        })
}

const exports = {
    getSheet,
    checkSheetValidity
}

export default exports

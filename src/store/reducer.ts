const initialState = {
    deckStarted: false,
    deckDialogOpen: false,
    demoDrawerOpen: false,
    introOpen: false,
    loginOpen: false,
    userName: ''
};

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'deck/setDeckStarted':
            return {
                ...state,
                deckStarted: action.value
            }
        case 'deck/setDialog':
            return {
                ...state,
                deckDialogOpen: action.value

            }
        case 'deck/setDemoDrawer':
            return {
                ...state,
                demoDrawerOpen: action.value
            }
        case 'modals/setIntroOpen':
            return {
                ...state,
                introOpen: action.value
            }
        case 'modals/setLoginOpen':
            return {
                ...state,
                loginOpen: action.value
            }
        case 'user/setUserName':
            return {
                ...state,
                userName: action.value
            }
        default:
            return state;
    }
};
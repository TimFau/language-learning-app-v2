import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        deckStarted: Boolean,
        deckDialogOpen: Boolean,
        demoDrawerOpen: Boolean,
        introOpen: Boolean,
        loginOpen: Boolean,
        userName: String
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
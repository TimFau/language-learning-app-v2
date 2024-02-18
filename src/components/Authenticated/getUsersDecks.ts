import deckService from 'services/deckService';

export default function getUsersDecks (userToken: string, userId: string) {
    return Promise.all([
        deckService.getUserDecks(userToken, userId),
        deckService.getSavedDecks(userToken, userId)
    ])
    .then(([userDecksResult, savedDecksResult]) => {
        const userDecks = userDecksResult.map((deck: any) => {
            return {
                type: "user",
                ...deck
            }
        })
        const savedDecks = savedDecksResult.map((deck: any) => {
            return {
                isSaved: true,
                savedDeckId: deck.id,
                ...deck
            }
        })
        return [...userDecks, ...savedDecks]
    })
}
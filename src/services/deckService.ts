import { PUBLIC_DECKS, DEMO_DECKS, USER_DECKS, SAVED_DECKS, CREATE_PUBLIC_DECK, SAVE_DECK } from "queries";

const endpoint = process.env.REACT_APP_API_BASE;

const fetchGraphQL = async (query: string, variables?: any, userToken?: string) => {
    try {
        const accessToken = userToken ? `?access_token=${userToken}` : ''
        const res = await fetch(endpoint + accessToken, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables })
        });
        return await res.json();
    } catch (error) {
        return console.error(error);
    }
}

const getCommunityDecks = async () => {
    const result = await fetchGraphQL(PUBLIC_DECKS);
    return result.data.public_lists;
}

const getDemoDecks = async () => {
    const result = await fetchGraphQL(DEMO_DECKS);
    return result.data.public_lists;
}

const addPrivateDeck = async (deckName: string, deckId: string, userToken: string) => {
    const result = await fetchGraphQL(CREATE_PUBLIC_DECK, { deckName, deckId }, userToken);
    return result;
}

const getUserDecks = async (userToken: string, userId: string) => {
    const result = await fetchGraphQL(USER_DECKS, { userId }, userToken);
    return result;
}

const getSavedDecks = async (userToken: string, userId: string) => {
    const result = await fetchGraphQL(SAVED_DECKS, { userId }, userToken);
    return result;
}

const favoriteDeck = async (userToken: string, communityDeckId: string) => {
    const result = await fetchGraphQL(SAVE_DECK, { communityDeckId }, userToken);
    return result;
} 

const deckService = {
    getCommunityDecks,
    getDemoDecks,
    addPrivateDeck,
    getUserDecks,
    getSavedDecks,
    favoriteDeck
}

export default deckService
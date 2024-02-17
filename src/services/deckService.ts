import { COMMUNITY_DECKS, DEMO_DECKS, USER_DECKS, SAVED_DECKS, CREATE_DECK, UPDATE_DECK, DELETE_DECK, SAVE_DECK, UNSAVE_DECK } from "queries";

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
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getCommunityDecks = async () => {
    const result = await fetchGraphQL(COMMUNITY_DECKS);
    return result.data.decks;
}

const getDemoDecks = async () => {
    const result = await fetchGraphQL(DEMO_DECKS);
    return result.data.decks;
}

const addDeck = async (deckName: string, deckId: string, nativeLanguage: string, learningLanguage: string, makePublic: boolean, userToken: string) => {
    const deckStatus = makePublic ? "published" : "private"
    const result = await fetchGraphQL(CREATE_DECK, { deckName, deckId, nativeLanguage, learningLanguage, deckStatus }, userToken);
    return result;
}

const updateDeck = async (deckName: string, deckId: string, nativeLanguage: string, learningLanguage: string, makePublic: boolean, id: string, userToken: string) => {
    const deckStatus = makePublic ? "published" : "private"
    const result = await fetchGraphQL(UPDATE_DECK, { deckName, deckId, nativeLanguage, learningLanguage, deckStatus, id }, userToken);
    return result;
}

const deleteDeck = async (userToken: string, deckId: string) => {
    const result = await fetchGraphQL(DELETE_DECK, { deckId }, userToken)
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

const saveDeck = async (userToken: string, communityDeckId: string) => {
    const result = await fetchGraphQL(SAVE_DECK, { communityDeckId }, userToken);
    return result;
}

const unsaveDeck = async (userToken: string, savedDeckId: string) => {
    try {
        const result = await fetchGraphQL(UNSAVE_DECK, { savedDeckId }, userToken);
        if (result.errors) {
            console.error(`Error unsaving deck ${savedDeckId}:`, result.errors[0].message);
        }
        return result;
    } catch (error) {
        console.error(`Error unsaving deck ${savedDeckId}:`, error);
        throw error;
    }
} 

const deckService = {
    getCommunityDecks,
    getDemoDecks,
    addDeck,
    updateDeck,
    deleteDeck,
    getUserDecks,
    getSavedDecks,
    saveDeck,
    unsaveDeck
}

export default deckService
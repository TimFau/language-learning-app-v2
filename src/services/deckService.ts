import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { COMMUNITY_DECKS, DEMO_DECKS, USER_DECKS, SAVED_DECKS, CREATE_DECK, UPDATE_DECK, DELETE_DECK, SAVE_DECK, UNSAVE_DECK } from "queries";

const endpoint = process.env.REACT_APP_API_BASE;

const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache()
});

const getCommunityDecks = async () => {
    const { data } = await client.query({ query: gql(COMMUNITY_DECKS) });
    return data.decks;
}

const getDemoDecks = async () => {
    const { data } = await client.query({ query: gql(DEMO_DECKS) });
    return data.decks;
}

const addDeck = async (deckName: string, deckId: string, nativeLanguage: string, learningLanguage: string, makePublic: boolean, userToken: string) => {
    const deckStatus = makePublic ? "published" : "private"
    const { data } = await client.mutate({ mutation: gql(CREATE_DECK), variables: { deckName, deckId, nativeLanguage, learningLanguage, deckStatus }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data;
}

const updateDeck = async (deckName: string, deckId: string, nativeLanguage: string, learningLanguage: string, makePublic: boolean, id: string, userToken: string) => {
    const deckStatus = makePublic ? "published" : "private"
    const { data } = await client.mutate({ mutation: gql(UPDATE_DECK), variables: { deckName, deckId, nativeLanguage, learningLanguage, deckStatus, id }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data;
}

const deleteDeck = async (userToken: string, deckId: string) => {
    const { data } = await client.mutate({ mutation: gql(DELETE_DECK), variables: { deckId }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data;
}

const getUserDecks = async (userToken: string, userId: string) => {
    const { data } = await client.query({
        query: gql(USER_DECKS),
        variables: { userId },
        context: { headers: { authorization: `Bearer ${userToken}` } },
        fetchPolicy: 'network-only'
    });
    // console.log('getUserDecks', data)
    return data.decks;
}

const getSavedDecks = async (userToken: string, userId: string) => {
    const { data } = await client.query({ query: gql(SAVED_DECKS), variables: { userId }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data.saved_decks;
}

const saveDeck = async (userToken: string, communityDeckId: object) => {
    const deckIdCopy = { ...communityDeckId }
    if ('user_created' in deckIdCopy) {
        delete deckIdCopy['user_created'];
    }
    if ('__typename' in deckIdCopy) {
        delete deckIdCopy['__typename'];
    }
    const { data } = await client.mutate({ mutation: gql(SAVE_DECK), variables: { communityDeckId: deckIdCopy }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data;
}

const unsaveDeck = async (userToken: string, savedDeckId: string) => {
    const { data } = await client.mutate({ mutation: gql(UNSAVE_DECK), variables: { savedDeckId }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data;
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
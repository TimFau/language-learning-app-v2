import { gql } from '@apollo/client';
import { client } from './../App'
import { DEMO_DECKS, USER_DECKS, SAVED_DECKS, CREATE_DECK, UPDATE_DECK, DELETE_DECK, SAVE_DECK, UNSAVE_DECK, UPDATE_SAVED_DECK } from "queries";

const getDemoDecks = async () => {
    const { data } = await client.query({ query: gql(DEMO_DECKS) });
    return data.decks;
}

const addDeck = async (deckName: string, deckId: string, nativeLanguage: string, learningLanguage: string, makePublic: boolean, userToken: string, userId: string) => {
    const deckStatus = makePublic ? "published" : "private"
    const { data } = await client.mutate({
        mutation: gql(CREATE_DECK),
        variables: { deckName, deckId, nativeLanguage, learningLanguage, deckStatus },
        context: { headers: { authorization: `Bearer ${userToken}` } },
        update: (cache, { data: { create_decks_item  } }) => {
            const existingDecks: any = cache.readQuery({ query: USER_DECKS, variables: { userId } });
            cache.writeQuery({
                query: USER_DECKS,
                variables: { userId },
                data: { decks: [create_decks_item, ...existingDecks.decks] }
            });
        }
    });
    return data;
}

const updateDeck = async (deckName: string, deckId: string, nativeLanguage: string, learningLanguage: string, makePublic: boolean, id: string, userToken: string) => {
    const deckStatus = makePublic ? "published" : "private"
    const { data } = await client.mutate({
            mutation: gql(UPDATE_DECK),
            variables: { deckName, deckId, nativeLanguage, learningLanguage, deckStatus, id },
            context: { headers: { authorization: `Bearer ${userToken}` } }
        });
    return data;
}

const deleteDeck = async (userToken: string, deckId: string, userId: string) => {
    const { data } = await client.mutate({
        mutation: gql(DELETE_DECK),
        variables: { deckId },
        context: { headers: { authorization: `Bearer ${userToken}` } },
        update: (cache, { data: { delete_decks_item  } }) => {
            const existingDecks: any = cache.readQuery({ query: USER_DECKS, variables: { userId } });
            const newDecks = existingDecks.decks.filter((deck: any) => deck.id !== delete_decks_item.id);
            cache.writeQuery({
                query: USER_DECKS,
                variables: { userId },
                data: { decks: newDecks }
            });
        }
    });
    return data;
}

const getSavedDecks = async (userToken: string, userId: string) => {
    const { data } = await client.query({ query: gql(SAVED_DECKS), variables: { userId }, context: { headers: { authorization: `Bearer ${userToken}` } } });
    return data.saved_decks;
}

const saveDeck = async (userToken: string, communityDeckId: object, userId: string) => {
    const deckIdCopy = { ...communityDeckId }
    if ('user_created' in deckIdCopy) {
        delete deckIdCopy['user_created'];
    }
    if ('__typename' in deckIdCopy) {
        delete deckIdCopy['__typename'];
    }
    const { data } = await client.mutate({
            mutation: gql(SAVE_DECK),
            variables: { communityDeckId: deckIdCopy },
            context: { headers: { authorization: `Bearer ${userToken}` } },
            update: (cache, { data: { create_saved_decks_item } }) => {
                const existingDecks: any = cache.readQuery({ query: gql`${SAVED_DECKS}`, variables: { userId } });
                cache.writeQuery({
                    query: gql`${SAVED_DECKS}`,
                    variables: { userId },
                    data: { saved_decks: [create_saved_decks_item, ...existingDecks.saved_decks] }
                })
            }
        });
    return data;
}

const unsaveDeck = async (userToken: string, savedDeckId: string, userId: string) => {
    const { data } = await client.mutate({
        mutation: gql(UNSAVE_DECK),
        variables: { savedDeckId },
        context: { headers: { authorization: `Bearer ${userToken}` } },
        update: (cache, { data: { delete_saved_decks_item } }) => {
            const existingDecks: any = cache.readQuery({ query: gql`${SAVED_DECKS}`, variables: { userId } });
            const newDecks = existingDecks.saved_decks.filter((deck: any) => deck.id !== delete_saved_decks_item.id);
            cache.writeQuery({
                query: gql`${SAVED_DECKS}`,
                variables: { userId },
                data: { saved_decks: newDecks }
            })
        }
    });
    return data;
}

const updateSavedDeck = async (userToken: string, savedDeckId: string, lastAccess: string) => {
    const { data } = await client.mutate({
        mutation: gql`${UPDATE_SAVED_DECK}`,
        variables: { id: savedDeckId, lastAccess },
        context: { headers: { authorization: `Bearer ${userToken}` } }
    });
    return data;
}

const deckService = {
    getDemoDecks,
    addDeck,
    updateDeck,
    deleteDeck,
    getSavedDecks,
    saveDeck,
    unsaveDeck,
    updateSavedDeck
}

export default deckService
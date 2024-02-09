import { PUBLIC_DECKS, DEMO_DECKS, USER_DECKS, CREATE_PUBLIC_DECK } from "queries";

const apiToken = process.env.REACT_APP_API_TOKEN;
const endpoint = process.env.REACT_APP_API_BASE;

const getCommunityDecks = () => {

    return fetch(endpoint + '?access_token=' + apiToken, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: PUBLIC_DECKS
        })
    })
    .then(res => res.json())
    .then(
        (result) => {
            return result.data.public_lists;
        }
    )
}

const getDemoDecks = () => {

    return fetch(endpoint + '?access_token=' + apiToken, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: DEMO_DECKS
        })
    })
    .then(res => res.json())
    .then(
        (result) => {
            return result.data.public_lists;
        }
    )
}

const addPrivateList = (deckName: string, deckId: string, userToken: string) => {
    let listsUrl = `${process.env.REACT_APP_API_BASE}?access_token=` + userToken;
    return fetch(listsUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: CREATE_PUBLIC_DECK, variables: { deckName, deckId }
        })
    })
    .then(res => res.json())
    .then(
        (result) => {
            console.log('new list result', result)
            return result
        },
        (error) => {
            console.log(error);
        }
    )
}

const getPrivateLists = (userToken: string, userId: string) => {
    let listsUrl = `${process.env.REACT_APP_API_BASE}?access_token=` + userToken;
    return fetch(listsUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: USER_DECKS, variables: { userId }
        })
    })
    .then(res => res.json())
    .then((result) => result)
}

export default {
    getCommunityDecks,
    getDemoDecks,
    addPrivateList,
    getPrivateLists
};